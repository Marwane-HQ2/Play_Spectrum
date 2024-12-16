let selectedTiles = {"selection": null}
// Setting the playground as a global variable
let hueAccomplished = []

// ----------------------- * ----------------------- //

function isCompleted () {
    let listColorTiles = document.querySelectorAll(".colorTiles") // C'est trop ma vie
    let listColorTilesCompleted = []
    
    for (let a of hueAccomplished) {
        listColorTilesCompleted = listColorTilesCompleted.concat(a)
    }
    for (let e=0; e<listColorTiles.length; e++) {
        if (listColorTiles[e].id != "#" + listColorTilesCompleted[e]) {
            return false
        }        
    }
    return true

}

function createDiv (id) { //ICI
    let newDiv = document.createElement('div')
    newDiv.classList.add(`sub`)
    newDiv.id = id // ICI
    document.getElementById("canva").appendChild(newDiv)
}
function createTile (color, idP) {
    let newTile = document.createElement('div')
    newTile.classList.add(`colorTiles`)
    newTile.id = color
    newTile.textContent = color
    newTile.style.backgroundColor = color

    // Click handle
    newTile.onclick = function selection (event) { 
        
        if (selectedTiles["selection"] === null) {
            selectedTiles["selection"] = newTile.id.slice(1)
        } else {
            let s = selectedTiles["selection"]
            let e = event.target.id.slice(1)
            
            const a = document.getElementById("#" + s)
            const b = document.getElementById("#" + e)

            const temp = a.innerHTML

            a.innerHTML = b.innerHTML
            b.innerHTML = temp

            a.style.backgroundColor = "#" + e
            b.style.backgroundColor = "#" + s

            a.id = "#" + e
            b.id = "#" + s

            selectedTiles["selection"] = null
        }
        if (isCompleted()) {
            alert("Congratulation you completed this level !")
            celebrate()
        }
    }
    document.getElementById(idP).appendChild(newTile)
}

function displayArrayOfColors (array, idP) {
    for (let k in array) {
        let idParent = `array-${k}`
        createDiv(idParent)
        for (color of array[k]) {
            if (color === null  || color === undefined) {
                createTile("#FFFFFF", idParent)
            }
            if (color != null) {
                while (color.length < 6) {
                    color = "0" + color
                }
                createTile("#" + color, idParent)
            }
        }
    }
}

function decimalToHex (number) {
    let converted = ""
    const indexHexa = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']        
    while (number != 0) {        
        converted += indexHexa[number % 16]
        number = Math.floor(number / 16)
    }
    let temp = ""
    for (e of converted) {
        temp = e + temp
    }
    converted = temp
    return converted
}

function hexToDecimal (n) { // ADDITIONNER R V ET B
    let number = n
    if (number[0] === "#") {
        let temp = ""
        for (let i=0; i<number.length; i++) {
            if (number[i] === "#") {continue}
            temp += number[i]
        }
        number = temp
    }
    let converted = 0
    const indexDeci = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15};

    let i = 1
    for (letter of number) {
        converted += indexDeci[letter] * (16** (number.length - i))
        i += 1
    }  

    return converted
}

function fullOfNull (tab) {
    for (e of tab) {
        if (e != null) {
            return false
        }
    }
    return true
}

function generateGradient (c1, c2, n) {
    /* Ces couleurs doivent être en HEXA sans "#" 
    Renvoie une liste de n + 2 couleurs pour passer de c1 à c2  
    [
        c1, cI1, cI2, ... , cIn-1, CIn, c2
    ]  
    */
    let color1 = c1
    let color2 = c2
    let nbInterColors = n + 1

    if (color1.length != 6)  {return}
    if (color2.length != 6)  {return}

    // Séparer le rouge, le vert et le bleu et convertir en DECIMAL
    let r1  = hexToDecimal(color1[0] + color1[1])
    let g1  = hexToDecimal(color1[2] + color1[3])
    let b1  = hexToDecimal(color1[4] + color1[5])

    let r2  = hexToDecimal(color2[0] + color2[1])
    let g2  = hexToDecimal(color2[2] + color2[3])
    let b2  = hexToDecimal(color2[4] + color2[5])

    // Trouver les couleurs intermédiaires:

    // Elles seront stockées ici
    let interColors = []

    // Décalage RGB:
    /* /!\ Lorsque ces variables atteignent des valeurs trop petites à cause de "nbInterColors" trop grand */
    let divColorR = Math.round((Math.abs(r1 - r2)) / nbInterColors)
    let divColorG = Math.round((Math.abs(g1 - g2)) / nbInterColors)
    let divColorB = Math.round((Math.abs(b1 - b2)) / nbInterColors)

    // Boucle pour générer les couleurs intermédiaires
    for (let i=0; i<nbInterColors; i++) {
        let r
        if (r1 <= r2) {r = decimalToHex(r1 + i*divColorR)}
        else {r = decimalToHex(r1 - i*divColorR)}

        let g
        if (g1 <= g2) {g = decimalToHex(g1 + i*divColorG)}
        else {g = decimalToHex(g1 - i*divColorG)}

        let b
        if (b1 <= b2) {b = decimalToHex(b1 + i*divColorB)}
        else {b = decimalToHex(b1 - i*divColorB)}

        if (r === "") {
            r = "00"
        }
        if (g === "") {
            g = "00"
        }
        if (b === "") {
            b = "00"
        }

        let nextColor = r + g + b
        while (nextColor.length < 6) {
            nextColor = "0" + nextColor
        }
        interColors.push(nextColor)
    }
    interColors.push(color2)
    
    return interColors
}

function getRandomInt(min, max) {
    /*Returns a random number, not including maximum (because lists... Like lists...) */
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateArrayOfColors (c1, c2, c3, c4, l) {
    /*
    Génère un nombre l de listes de listes de dégradés. Chaque liste fait la taille l.
    Chaque couleur apparaît deux fois.
    [
        [c1, cA1, cB2, cB3, cI], // MODIFIER LIGNE 1 ET COLONNE 2
        [cB3,     ...    , cB4],
        [cB2,     ...    , cB5],
        [cB1,     ...    , cB6],
        [cI, cA3, cA2, cA1, c2] 
    ]
        CI = cB0
        c1 = cB4
        c2 = cA0
        Avec cA1 = cB1, cA2 = cB2, etc
    
    */
    let color1 = c1
    let color2 = c2
    let color3 = c3
    let color4 = c4
    let len = l+2 // ICIIIIIIIIIIIIIIIIIIII

    let arrayColors = []

    for (let i=0; i<len; i++) {
        let temp = []
        for (let j=0; j<len; j++) {
            temp.push(null)
        }
        arrayColors.push(temp)
    }

    arrayColors[0][0] = color1
    arrayColors[0][len-1] = color2
    arrayColors[len-1][0] = color3
    arrayColors[len-1][len-1] = color4
    
    arrayColors[0] = generateGradient(arrayColors[0][0], arrayColors[0][len-1], len)
    arrayColors[len-1] = generateGradient(arrayColors[len-1][0], arrayColors[len-1][len-1], len)

    if (true) { // Colonnes et lignes mutées
        let temp = []
        for (let e=0; e<arrayColors.length+2; e++) {
            temp.push([])
            for (a of arrayColors) {
                temp[e].push(a[e])
            }
        }
        arrayColors = [...temp]
    }
    for (let index in arrayColors) {
        arrayColors[index] = generateGradient(arrayColors[index][0], arrayColors[index][ arrayColors[index].length -1], len)
    }
    return  arrayColors

}

// ----------------------- JEU ----------------------- //

function play () {
    hueAccomplished = generateArrayOfColors("FF0000", "0000FF", "00FF00", "000000", 1)

    let hue = []
    for (let a=0; a<hueAccomplished.length ; a++) {
        hue.push([...hueAccomplished[a]])
    }
    for (let a of hue) {a.sort(() => Math.random() - 0.5)}

    displayArrayOfColors(hueAccomplished, "canva")
        setTimeout(() => { 
            document.getElementById("canva").innerHTML = ""
        displayArrayOfColors(hue, "canva")
    }, 8000)
    
    
    
    
}

play()

// ----------------------- CSS ----------------------- //

function celebrate () {
    console.log("Well done !")
    // comming next update !
}