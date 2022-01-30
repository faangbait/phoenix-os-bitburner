import { openDB, deleteDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

/**
 * Returns a db object that can be used to interact with IndexedDB.
 * More functionality to probably come.
 *
 * @return {Promise<openDB>} 
 */
export const handleDB = async () => {
    return await openDB("phoenixOS", 2, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (oldVersion < 2) {
                db.createObjectStore("player", { keyPath: 'id' });
                db.createObjectStore("servers", { keyPath: 'id' });
                db.createObjectStore("factions", { keyPath: 'name' });
                db.createObjectStore("augmentations", { keyPath: 'name' });
                db.createObjectStore("misc", { keyPath: 'id' });
            }
        },
        blocked() {
            // …
        },
        blocking() {
            // …
        },
        terminated() {
            // …
        },
    });
};

/**
 * 
 * Gets cached server data from the last loop. Faster, more efficient, and more reliable,
 * ideal for when decision-making data isn't required or available.
 * 
 * const srv = await cachedServer("foodnstuff")
 * ns.tprint(srv.money.available)
 * 
 * @param {string} hostname 
 * @returns {Promise<ServerObject>}
 */
export const cachedServer = async (hostname) => {
    const db = await handleDB();
    return await db.get("servers", hostname);
};