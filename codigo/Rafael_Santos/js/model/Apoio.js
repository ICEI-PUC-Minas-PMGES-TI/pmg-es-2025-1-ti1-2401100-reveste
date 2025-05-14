export default class Apoio {
    id;
    nome;
    imagem;
    endereço;
    local;

    constructor(fromObj) {
        this.id = fromObj.id;
        this.nome = fromObj.nome;
        this.imagem = fromObj.imagem;
        this.endereço = fromObj.endereço;
        this.local = fromObj.local;
    }
}