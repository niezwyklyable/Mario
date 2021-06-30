
class Platforma {
    constructor(img, x, y, w, h, z) {
        this.obraz = new Obraz(img, 3408, 192, 48, 8)

        this.stan = {
            poruszanie: {
                ruch: (data) => {
                    if (this.x <= this.zakres.min + data.obiekty.mapa.x) {
                        this.x = this.zakres.min + data.obiekty.mapa.x
                        this.pedX = 3
                    }

                    if (this.x + this.w >= this.zakres.max + data.obiekty.mapa.x) {
                        this.x = this.zakres.max + data.obiekty.mapa.x - this.w
                        this.pedX = -3
                    }

                    this.x += this.pedX
                }
            }
        }

        this.obecnyStan = this.stan.poruszanie
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pedX = 3
        this.zakres = z
        this.typ = "platforma"
    }
}