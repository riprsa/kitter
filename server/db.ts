import fs from 'fs';
import { Database } from 'sqlite3';
import * as cat from "./../codegen/cat";

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

    insertCat(cat: cat.CreateCatRequest): Promise<number> {
        return new Promise((resolve, reject) => {
            const statement = this.db.prepare(
                `INSERT INTO cat (name, username, bio) VALUES (?, ?, ?)`
            )

            statement.run(
                [cat.name, cat.username, cat.bio],
                (err) => {
                    if (err) {
                        reject(err);
                    }
                },
            );
            statement.finalize();

            this.db.get<{
                id: number
            }>('SELECT last_insert_rowid() as id', (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.id);
                }
            });
        });
    }
}
