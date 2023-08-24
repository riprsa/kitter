import fs from 'fs';
import { Database } from 'sqlite3';

interface CatSelectSchema {
    id: number;
    name: string;
    username: string;
    bio?: string;

    password: string;
}

interface CatInsertSchema {
    name: string;
    username: string;
    bio?: string;

    password: string;
}

interface KittSelectSchema {
    id: number;
    content: string;
    created_at: string;
    cat_id: number;
}

interface KittInsertSchema {
    content: string;
    cat_id: number;
}

export class Storage {
    db: Database;

    constructor() {
        this.db = new Database('./../cat.sqlite');

        this.db.exec(
            fs.readFileSync(__dirname + '/../sql/createCat.sql').toString(),
            err => {
                if (err) return console.log(err);
            },
        );

        this.db.exec(
            fs.readFileSync(__dirname + '/../sql/createKitt.sql').toString(),
            err => {
                if (err) return console.log(err);
            },
        );
    }

    insertCat(cat: CatInsertSchema): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.prepare(
                `INSERT INTO cat (name, username, bio, password) VALUES (?, ?, ?, ?)`
            ).run(
                [cat.name, cat.username, cat.bio, cat.password],
                (err) => {
                    if (err) reject(err);
                },
            ).finalize();

            this.db.get<{ id: number }>(
                'SELECT last_insert_rowid() as id',
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row.id);
                }
            );
        });
    }

    selectCat(id: number): Promise<CatSelectSchema> {
        return new Promise((resolve, reject) => {
            this.db.get<CatSelectSchema>(
                'SELECT * FROM cat WHERE id = ?', [id],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
        });
    }

    findCat(username: string): Promise<CatSelectSchema> {
        return new Promise((resolve, reject) => {
            this.db.get<CatSelectSchema>(
                'SELECT * FROM cat WHERE username = ?', [username],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
        });
    }

    insertKitt(kitt: KittInsertSchema): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.prepare(
                `INSERT INTO kitt (content, cat_id) VALUES (?, ?)`
            ).run(
                [kitt.content, kitt.cat_id],
                (err) => {
                    if (err) reject(err);
                },
            ).finalize();

            this.db.get<{ id: number }>(
                'SELECT last_insert_rowid() as id',
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row.id);
                }
            );
        });
    }

    selectKitt(id: number): Promise<KittSelectSchema> {
        return new Promise((resolve, reject) => {
            this.db.get<KittSelectSchema>(
                'SELECT * FROM kitt WHERE id = ?', [id],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row);
                });
        });
    }

    selectKittsByCatId(cat_id: number): Promise<KittSelectSchema[]> {
        return new Promise((resolve, reject) => {
            this.db.all<KittSelectSchema>(
                'SELECT * FROM kitt WHERE cat_id = ?', [cat_id],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
        });
    }

    selectAllKitts(): Promise<KittSelectSchema[]> {
        return new Promise((resolve, reject) => {
            this.db.all<KittSelectSchema>(
                'SELECT * FROM kitt',
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
        });
    }
}
