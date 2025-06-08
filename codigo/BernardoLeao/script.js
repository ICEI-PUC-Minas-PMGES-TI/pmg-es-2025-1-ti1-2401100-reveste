<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desapeguai</title>
    <link rel="stylesheet" href="main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="sombra">
        <div class="LoginBemSucedido">
            <header>
                <svg id="fecharM1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-x" viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </header>
            <h1>Login bem sucedido</h1>
        </div>

        <div class="PontoDeApoioNaoEncontrado">
            <header>
                <svg id="fecharM2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-x" viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </header>
            <h1>Ponto de Apoio não encontrado</h1>
        </div>

        <div class="CadastroBemSucedido">
            <header>
                <svg id="fecharM3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-x" viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </header>
            <h1>Cadastrado com sucesso!</h1>
        </div>

        <div class="DoadorNaoEncontrado">
            <header>
                <svg id="fecharM4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-x" viewBox="0 0 16 16">
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </header>
            <h1>Usuário não encontrado!</h1>
        </div>
    </div>

    <div class="container">
        <img id="logo" class="animated-4" src="imgs/Logo.svg" alt="">
        <h1 id="desc" class="animated-4">Doando o que não precisa para ajudar quem necessita</h1>

        <nav>
            <div id="divPapel1" class="animated-1 delay-1">
                <div class="img1"></div>
                <h2>Quero Roupa</h2>
            </div>
            <div id="divPapel2" class="animated-2 delay-2">
                <div class="img2"></div>
                <h2>Quero Doar</h2>
            </div>
            <div id="divPapel3" class="animated-3 delay-3">
                <div class="img3"></div>
                <h2>Sou Ponto de Apoio</h2>
            </div>
        </nav>

        <button id="btnProsseguir" class="animated-2" disabled>
            <span>Prosseguir</span>
            <div>
                <svg class="primeiraSeta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
                <svg class="segundaSeta" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
            </div>
        </button>
    </div>


    <div class="containerPA">
        <div class="imgIgreja"></div>
        <header>
            <button class="btnVoltar1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path
                        d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                </svg>
                <span>Voltar</span>
            </button>
        </header>
        <div class="divLoginPA">
            <h1>Login</h1>

            <div class="divInputsLogin">
                <span>CNPJ</span>
                <input type="text" id="inputCNPJ">
            </div>
            <div class="divInputsLogin">
                <span>Senha</span>
                <input type="password" id="inputSenha" maxlength="100">
            </div>

            <div class="link-esqueceu-a-senha">
                <a href="">Esqueceu a senha?</a>
            </div>

            <button id="btnEntrar" disabled>Entrar</button>

            <span>Não cadastrou seu ponto de apoio? <button>Cadastrar-se</button></span>
        </div>

        <div class="divCadastrarPA">
            <h1>Cadastrar</h1>

            <div class="containerCadastrar">
                <div class="divInputsCadastrar">
                    <span>Nome:</span>
                    <input type="text" id="nome" class="inputNome">
                </div>
                <div class="divInputsCadastrar">
                    <span>Endereço:</span>
                    <input type="text" id="endereco" class="inputEndereco">
                </div>
                <div class="containerInputsCadastro">
                    <div class="divInputsCadastrar">
                        <span>Telefone:</span>
                        <input type="text" id="telefone" class="inputTelefone">
                    </div>

                    <div class="divInputsCadastrar">
                        <span>CNPJ:</span>
                        <input type="text" id="cnpjCadastro" class="inputCNPJCadastro">
                    </div>
                </div>
                <div class="divInputsCadastrar">
                    <span>Email:</span>
                    <input type="text" id="email" class="inputEmail">
                </div>
                <div class="divInputsCadastrar">
                    <span>Senha:</span>
                    <input type="text" id="senhaCadastro" class="inputSenhaCadastro">
                </div>
                <div class="divTemporario">
                    <div class="divCheckbox">
                        <input class="checkbox" type="checkbox">
                        <span>Temporária?</span>
                    </div>

                    <div class="divDataPA">
                        <input class="inputInicio" id="inicio" type="text" placeholder="De">
                        <input class="inputFinal" id="final" type="text" placeholder="Até">
                    </div>
                </div>
            </div>

            <button id="btnCadastrar" disabled>Cadastrar</button>

            <span>Já é cadastrado? <button>Entrar</button></span>
        </div>
    </div>

    <div class="containerDoador">
        <header>
            <button class="btnVoltar2">
                <span>Voltar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path
                        d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                </svg>
            </button>
        </header>

        <div class="divLoginDoador">
            <h1>Login</h1>

            <div class="divInputsLoginDoador">
                <span>CPF</span>
                <input type="text" id="inputCPFDoador">
            </div>
            <div class="divInputsLogin">
                <span>Senha</span>
                <input type="password" id="inputSenhaDoador" maxlength="100">
            </div>

            <div class="link-esqueceu-a-senha">
                <a href="">Esqueceu a senha?</a>
            </div>

            <button id="btnEntrarDoador" disabled>Entrar</button>

            <span>Não cadastrou seu ponto de apoio? <button>Cadastrar-se</button></span>
        </div>

        <div class="divCadastrarDO">
            <h1>Cadastrar</h1>

            <div class="containerCadastrarDO">
                <div class="divInputsCadastrarDO">
                    <span>Nome:</span>
                    <input type="text" id="nomeDoador" class="inputNomeDoador">
                </div>
                <div class="divInputsCadastrarDO">
                    <span>Endereço:</span>
                    <input type="text" id="enderecoDoador" class="inputEnderecoDoador">
                </div>
                <div class="containerInputsCadastroDO">
                    <div class="divInputsCadastrarDO">
                        <span>Telefone:</span>
                        <input type="text" id="telefoneDoador" class="inputTelefoneDoador">
                    </div>

                    <div class="divInputsCadastrarDO">
                        <span>CPF:</span>
                        <input type="text" id="cpfCadastroDoador" class="inputCPFCadastroDoador">
                    </div>
                </div>
                <div class="divInputsCadastrarDO">
                    <span>Email:</span>
                    <input type="text" id="emailDoador" class="inputEmailDador">
                </div>
                <div class="divInputsCadastrarDO">
                    <span>Senha:</span>
                    <input type="text" id="senhaCadastroDoador" class="inputSenhaCadastroDoador">
                </div>
            </div>

            <button id="btnCadastrarDoador" disabled>Cadastrar</button>

            <span>Já é cadastrado? <button>Entrar</button></span>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.js"></script>
    <script src="script.js"></script>
</body>

</html>