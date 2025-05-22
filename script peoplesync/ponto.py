import mysql.connector
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()

def pegar_ids(cursor, tabela, coluna_id):
    cursor.execute(f"SELECT {coluna_id} FROM {tabela}")
    resultados = cursor.fetchall()
    return [r[0] for r in resultados]

def inserir_pontos():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='registro_ponto'
        )
        cursor = conn.cursor()

        # Pega todos os employeeIds e projectIds e tags
        employee_ids = pegar_ids(cursor, "Employees", "id")
        cursor.execute("SELECT id, tag FROM Projects")
        projetos = cursor.fetchall()  # lista de tuplas (id, tag)

        if not employee_ids or not projetos:
            print("Não há dados suficientes em Employees ou Projects.")
            return

        for _ in range(50):  # gera 20 registros, ajuste o quanto quiser
            employeeId = random.choice(employee_ids)
            projectId, projectTag = random.choice(projetos)

            # Data do ponto - random nos últimos 30 dias
            date = fake.date_between(start_date='-7d', end_date='today').strftime('%Y-%m-%d')

            # Horário de início entre 7h e 10h
            start_hour = random.randint(7, 10)
            start_minute = random.randint(0, 59)
            start = f"{start_hour:02d}:{start_minute:02d}"

            # Horário de fim entre start + 1 e start + 9 horas
            duration_hours = random.randint(1, 9)
            end_time = (datetime.strptime(start, "%H:%M") + timedelta(hours=duration_hours)).time()
            end = end_time.strftime("%H:%M")

            duration = duration_hours  # em horas

            description = fake.sentence(nb_words=8)
            createdBy = fake.name()
            updatedBy = None  # pode ser None ou algum nome aleatório

            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            sql = """
                INSERT INTO TimeEntries (
                    employeeId, projectId, projectTag, date, start, end, duration,
                    description, createdBy, updatedBy, createdAt, updatedAt
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                employeeId, projectId, projectTag, date, start, end, duration,
                description, createdBy, updatedBy, now, now
            )

            cursor.execute(sql, values)

        conn.commit()
        print("Registros de pontos inseridos com sucesso!")

    except mysql.connector.Error as err:
        print(f"Erro ao conectar ou inserir: {err}")

    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

inserir_pontos()
