from funcionario import inserir_funcionarios_no_mysql
from projeto import inserir_projetos_no_mysql
from ponto import inserir_pontos

def main():
    print("Inserindo funcionários...")
    inserir_funcionarios_no_mysql()
    print("Funcionários inseridos.\n")

    print("Inserindo projetos...")
    inserir_projetos_no_mysql()
    print("Projetos inseridos.\n")

    print("Inserindo pontos...")
    inserir_pontos()
    print("Pontos inseridos.\n")

if __name__ == "__main__":
    main()
