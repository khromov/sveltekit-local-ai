// Simple IndexedDB cache for model files
class ModelCache {
	private dbName: string;
	private storeName: string;
	private version: number;
	private db: IDBDatabase | null;

	constructor() {
		this.dbName = 'tts-cache';
		this.storeName = 'models';
		this.version = 1;
		this.db = null;
	}

	async init(): Promise<IDBDatabase> {
		if (this.db) return this.db;

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const target = event.target as IDBRequest;
				if (target) {
					const db = target.result as IDBDatabase;
					if (!db.objectStoreNames.contains(this.storeName)) {
						const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
						store.createIndex('timestamp', 'timestamp', { unique: false });
					}
				}
			};
		});
	}

	async get(url: string): Promise<ArrayBuffer | null> {
		await this.init();

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error('Database not initialized'));
				return;
			}
			const transaction = this.db.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(url);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const result = request.result;
				if (result) {
					// Check if cache is still valid (7 days)
					const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
					if (Date.now() - result.timestamp < maxAge) {
						resolve(result.data);
						return;
					} else {
						// Cache expired, remove it
						this.delete(url);
					}
				}
				resolve(null);
			};
		});
	}

	async set(url: string, data: ArrayBuffer): Promise<void> {
		await this.init();

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error('Database not initialized'));
				return;
			}
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.put({
				url,
				data,
				timestamp: Date.now()
			});

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async delete(url: string): Promise<void> {
		await this.init();

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error('Database not initialized'));
				return;
			}
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(url);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async clear(): Promise<void> {
		await this.init();

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error('Database not initialized'));
				return;
			}
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.clear();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
}

// Cached fetch function for model files
export async function cachedFetch(url: string): Promise<Response> {
	const cache = new ModelCache();

	// Try to get from cache first
	const cachedData = await cache.get(url);
	if (cachedData) {
		return new Response(cachedData);
	}

	// Fetch from network
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	// Store in cache for next time
	const data = await response.arrayBuffer();
	await cache.set(url, data);

	// Return a new response with the data
	return new Response(data, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}

export default ModelCache;
