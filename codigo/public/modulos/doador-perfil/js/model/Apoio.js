export default class Apoio {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.endereço = data.endereço;
        this.telefone = data.telefone;
        this.imagem = data.imagem;
        this.local = data.local;
        this.necessidades = data.necessidades || [];
    }

    getDistancia(userLat, userLng) {
        const lat1 = parseFloat(this.local.x);
        const lng1 = parseFloat(this.local.y);
        const lat2 = userLat;
        const lng2 = userLng;

        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distância em km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}
