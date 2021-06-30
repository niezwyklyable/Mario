
class Flaga {
    constructor(img, x, y, w, h) {

        this.obraz = new Obraz(img, 3568, 192, 16, 16)

        this.stan = {
            spoczynekNaGorze: {
                ruch: (data) => {
                    return
                }
            },
            opadanie: {
                ruch: (data) => {
                    this.y += this.pedY
                    this.droga += this.pedY
                    if (this.droga >= 312) {
                        this.obecnyStan = this.stan.spoczynekNaDole
                    }
                }
            },
            spoczynekNaDole: {
                ruch: (data) => {
                    return
                }
            }
        }

        this.obecnyStan = this.stan.spoczynekNaGorze
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pedY = 3
        this.droga = 0
        this.licznikMonet = 0
        this.typ = "flaga"
    }
}