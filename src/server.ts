import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

interface Jugador extends RowDataPacket {
    id: number;
    nombre: string;
    valor_mercado_millones: number;
    en_activo: boolean;
}

app.get('/', (req: Request, res: Response) => {
    res.send(`
        <h1>API de jugadores de futbol</h1>
        <a href="/api/datos">Ver todos los jugadores</a>
    `);
});

app.get('/api/datos', async (req: Request, res: Response) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'futbol'
        });

        const [rows] = await connection.execute<Jugador[]>('SELECT * FROM jugadores');
        
        res.json(rows);
        await connection.end();

    } catch (error) {
        console.error('Error en la conexión:', error);
        res.status(500).json({ error: 'No se pudo conectar con el vestuario (Base de Datos).' });
    }
});

app.listen(port, () => {
    console.log(` El partido ha comenzado en http://localhost:${port}`);

});
