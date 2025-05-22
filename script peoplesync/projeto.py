import mysql.connector
from faker import Faker
from datetime import datetime

fake = Faker()

def inserir_projetos_no_mysql():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='registro_ponto'
        )
        cursor = conn.cursor()

        for _ in range(5):  # Ajuste a quantidade que desejar
            name_project = fake.catch_phrase()
            tag = fake.word()
            description = fake.text(max_nb_chars=200)
            status = ("active")

            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            sql = """
                INSERT INTO Projects (name_project, tag, description, status, createdAt, updatedAt)
                VALUES (%s, %s, %s, %s, %s, %s)
            """

            values = (name_project, tag, description, status, now, now)

            cursor.execute(sql, values)

        conn.commit()
        print("Projetos inseridos com sucesso!")

    except mysql.connector.Error as err:
        print(f"Erro ao conectar ou inserir: {err}")

    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Executa a função
inserir_projetos_no_mysql()
