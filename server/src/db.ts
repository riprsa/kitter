import fs from 'fs';
import { Database } from 'sqlite3';

interface CatSchema {
    id: number;
    name: string;
    username: string;
    bio?: string;
}

interface CatInsertSchema {
    name: string;
    username: string;
    bio?: string;
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
    }

    insertCat(cat: CatInsertSchema): Promise<number> {
        return new Promise((resolve, reject) => {
            const statement = this.db.prepare(
                `INSERT INTO cat (name, username, bio) VALUES (?, ?, ?)`
            )

            statement.run(
                [cat.name, cat.username, cat.bio],
                (err) => {
                    if (err) reject(err);
                },
            );
            statement.finalize();

            this.db.get<{ id: number }>(
                'SELECT last_insert_rowid() as id',
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row.id);
                });
        });
    }

    selectCat(id: number): Promise<CatSchema> {
        return new Promise((resolve, reject) => {
            this.db.get<CatSchema>(
                'SELECT * FROM cat WHERE id = ?', [id],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
        });
    }
}
