class Utils {
    coverteHora(num) {
        const hora = num / 2
        if (Number.isInteger(hora)) {
            return `${hora}:00`
        } else {
            return `${Math.trunc(hora)}:30`
        }
    }
}

export default new Utils