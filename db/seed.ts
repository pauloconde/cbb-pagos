import { db, User, Partner, Payment } from 'astro:db';

export default async function () {
	// Seed Admin User (handle if exists)
	try {
		await db.insert(User).values([
			{
				id: "admin_user_id",
				username: "admin",
				// Password: 123456
				password_hash: "5b44a821e6e1bf545c849fd277a1fbdc:a45cb3c6243aa21cf8845609c1599f5175c43e15216602b55d682b50acfdbeeec61d1fc93e2c1c6b18b7e5392fc58725c9d4de256f4b5d6ee789b4f66"
			}
		]);
	} catch (e) {
		console.log("Admin user might already exist, skipping...");
	}

	// Seed Partners
	// Using 'nombre_corto' as 'name' based on user input mapping
	await db.insert(Partner).values([
		{ cedula: "10315646", name: "Mario Santiago" },
		{ cedula: "11186504", name: "César Medina" },
		{ cedula: "11192543", name: "Jesús Piñero" },
		{ cedula: "11709954", name: "Leonardo Albornoz" },
		{ cedula: "11710649", name: "Lenin García" },
		{ cedula: "12196236", name: "Milvier Ortiz" },
		{ cedula: "13280440", name: "Juan Berrios" },
		{ cedula: "18527721", name: "Jesús Moyetones" },
		{ cedula: "1986405", name: "Pedro Angarita" },
		{ cedula: "21431651", name: "Marconi Almagro" },
		{ cedula: "26392401", name: "Andrés Camargo" },
		{ cedula: "4258842", name: "Rubén Acosta" },
		{ cedula: "4931262", name: "Gustavo Tapia" },
		{ cedula: "-", name: "Oswaldo Materán" },
		{ cedula: "80411764", name: "Paulo Conde" },
		{ cedula: "8140732", name: "Antonio Materán" },
		{ cedula: "9385290", name: "José Peralta" },
		{ cedula: "13062891", name: "José Piñero" }
	]);
}
