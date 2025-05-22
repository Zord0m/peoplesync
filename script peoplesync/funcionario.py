import mysql.connector
from faker import Faker
import bcrypt
from datetime import datetime

fake = Faker()

def gerar_senha_criptografada(senha):
    return bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def inserir_funcionarios_no_mysql():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            database='registro_ponto'
        )

        cursor = conn.cursor()

        for _ in range(20):  # Ajuste a quantidade que desejar
            name = fake.name()
            email = fake.unique.email()
            role = "Desenvolvedor"
            contractType = fake.random_element(elements=("clt", "pj", "estagio"))
            register = fake.unique.bothify(text='######')
            type_user = "comum"
            senha = gerar_senha_criptografada("senha123")  # Senha padrão
            pcd = fake.boolean()
            birthDate = fake.date_of_birth(minimum_age=18, maximum_age=65).strftime("%Y-%m-%d")
            gender = fake.random_element(elements=("masculino", "feminino", "outro"))
            isActive = fake.boolean()

            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            sql = """
                INSERT INTO Employees (
                    name, email, role, contractType, register, type,
                    password, pcd, birthDate, gender, isActive,
                    createdAt, updatedAt
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                name, email, role, contractType, register, type_user,
                senha, pcd, birthDate, gender, isActive,
                now, now
            )

            cursor.execute(sql, values)

        conn.commit()
        print("Funcionários inseridos com sucesso!")

    except mysql.connector.Error as err:
        print(f"Erro ao conectar ou inserir: {err}")

    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Executa a função
inserir_funcionarios_no_mysql()
