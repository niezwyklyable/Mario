
class FragmentCegiel {
    constructor(img, x, y, w, h, n) {
        if (n == 0) {
            this.obraz = new Obraz(img, 3408, 160, 8, 8)
            this.pedX = -2
            this.pedY = -5
        } else if (n == 1) {
            this.obraz = new Obraz(img, 3416, 160, 8, 8)
            this.pedX = 2
            this.pedY = -5
        } else if (n == 2) {
            this.obraz = new Obraz(img, 3408, 168, 8, 8)
            this.pedX = -3
            this.pedY = 0
        } else {
            this.obraz = new Obraz(img, 3416, 168, 8, 8)
            this.pedX = 3
            this.pedY = 0
        }

        this.stan = {
            poruszanie: {
                ruch: (data) => {
                    this.x += this.pedX
                    this.y += this.pedY
                    if (this.y > data.obiekty.mapa.h) {
                        var nrFragmentu = data.obiekty.tabelaFragmentowCegiel.indexOf(this)
                        data.obiekty.tabelaFragmentowCegiel.splice(nrFragmentu, 1)
                    }
                }
            }
        }

        this.obecnyStan = this.stan.poruszanie
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.typ = "fragmentCegiel"
    }
}