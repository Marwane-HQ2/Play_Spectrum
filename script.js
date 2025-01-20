let selectedTiles = {"selection": null}
// Setting the playground as a global variable
let hueAccomplished = []
let playing = false

// ----------------------- * ----------------------- //

function isCompleted () {
    let listColorTiles = document.querySelectorAll(".colorTiles")
    let listColorTilesCompleted = []
    let z = true

    for (let a of hueAccomplished) {
        listColorTilesCompleted = listColorTilesCompleted.concat(a)
    }
    for (let e=0; e<listColorTiles.length; e++) {
        if (listColorTiles[e].id != "#" + listColorTilesCompleted[e]) {
            z = false
        }        
    }
    
    for (let a of customHueAccomplished) {
        listColorTilesCompleted = listColorTilesCompleted.concat(a)
    }
    for (let e=0; e<listColorTiles.length; e++) {
        if (listColorTiles[e].id != "#" + listColorTilesCompleted[e]) {
            return false
        }        
    }
    return z || true

}

function createDiv (id) { //ICI
    let newDiv = document.createElement('div')
    newDiv.classList.add(`sub`)
    newDiv.id = id // ICI
    document.getElementById("canva").appendChild(newDiv)
}
function createTile (color, idP, blockedTile = false) {
    let newTile = document.createElement('div')
    newTile.classList.add(`colorTiles`)
    newTile.id = color
    newTile.textContent = color
    newTile.style.backgroundColor = color

    // Click handle
    if (!blockedTile) {
        newTile.onclick = function selection (event) { 
            if (!playing) {return}
            
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
            if (isCompleted() && playing) {
                alert("Congratulation you completed this level !")
                // able the buttons 
                ableLevelButton()
                document.getElementById('countdown').innerHTML = `<span class="instructions">Congratulation !</span> <button id='end' onclick='giveUp()'>Close</button>`

                celebrate()
            }
        }
    }
    else {
        newTile.classList.add("blocked")
    }
    document.getElementById(idP).appendChild(newTile)
}

function displayArrayOfColors (array) {
    for (let k in array) {
        let idParent = `array-${k}`
        createDiv(idParent)
        for (let i in array[k]) {
            color = array[k][i]
            if (color === null  || color === undefined) {
                createTile("#FFFFFF", idParent)
            }
            if (color != null) {
                while (color.length < 6) {
                    color = color + "0" 
                }
                if (color[6] == "*") {
                    color = color.slice(0, 6)
                    createTile("#" + color, idParent, true)
                }
                else {createTile("#" + color, idParent)}
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
        else if (r.length == 1) {
            r = "0" + r
        }

        if (g === "") {
            g = "00"
        }
        else if (g.length == 1) {
            g = "0" + g
        }

        if (b === "") {
            b = "00"
        }
        else if (b.length == 1) {
            b = "0" + b
        }

        let nextColor = r + g + b
        while (nextColor.length < 6) {
            nextColor = nextColor + "0"
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
    let len = l+2

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

    return arrayColors
}

function shuffleArray (h) {
    let hue = []
    for (o of h) {
        hue.push([...o])
    }

    let len = hue[0].length

    let list = []
    for (let a of hue) {
        list += a
        list += "," // Pour séparer les listes entre elles lors de la concaténation
    }
    
    list = list.split(",") // On a fusionné toutes les listes en une big liste
    list.pop() // Pour enlever le dernier element généré par l'ajout de virgules plus haut
    hue = [...list] // On copie la liste dans hue
    list.sort(() => Math.random() - 0.5) // On mélange la big liste

    // On bloque la position des quatres couleurs de coins 
    // On commence par bien les placer
    let c1 = h[0][0]
    let c2 = h[0][h[0].length -1]
    let c3 = h[h.length -1][0]
    let c4 = h[h.length -1][h[h.length -1].length -1]
    for (let k of [hue.indexOf(c1), hue.indexOf(c2), hue.indexOf(c3), hue.indexOf(c4)] ) { 
        let copy = list[list.indexOf(hue[k])] // Une variable temporaire qui contient les couleurs des quatres coins
        list[list.indexOf(hue[k])] = list[k]
        list[k] = copy + "*"
    }
    let temp = [] // On reforme la big liste
    for (let i=0; i<len; i++) { // On reconstruit nos listes
        temp.push([])
        for (let j=0; j<len; j++) {
            temp[i].push(list.shift())
        }
    }

    return temp
}
// ----------------------- JEU ----------------------- //
let interval
let timeout
const LEVELS = {
    "1": {
        "colors": ["FF0000", "0000FF", "00FF00", "000000"],
        "difficulty": "easy",
        "tip": "Green colors can be tricky ! Convert HEX codes to decimal and sort them."
    }, 
    "2": {
        "colors": ["358600", "75F6FF", "8377D1", "FFFFFF"],
        "difficulty": "medium",
        "tip": "Maybe focus on edges and then complete the center."
    },
    "3": {
        "colors": ["247BA0", "C3B299", "596F43", "50514F"],
        "difficulty": "medium",
        "tip": "Center colors are similar so look for similar HEX codes."
    }, 
    "4": {
        "colors": ["B39C4D", "34623F", "9A6D38", "CC3F0C"],
        "difficulty": "hard",
        "tip": "Put green, yellow, brown and orange colors in a distinct way, then sort them."
    },
    "5": {
        "colors": ["373D20", "717744", "BCBD8B", "766153"],
        "difficulty": "hard",
        "tip": "Figure out all alone !"
    },
    "6": {
        "colors": ["FFA600", "000000", "FFFFFF", "0000A5"],
        "difficulty": "easy",
        "tip": "The four colors on the corners have very high contrast, use this to help you"
    },
    "7": {
        "colors": ["0059FF", "FFEF00", "08A04B", "E41B17"],
        "difficulty": "medium",
        "tip": "Focus on first and last column first"
    },

    "8": {
        "colors": ["7D0552", "FDEEF4", "EB5406", "36013F"],
        "difficulty": "medium",
        "tip": "Brighter colors are closer to the top right corner"
    },
    "9": {
        "colors": ["98FF98", "E42217", "967BB6", "848B79"],
        "difficulty": "hard",
        "tip": "Use HEX codes to sort colors"
    },
    "10": {
        "colors": ["FD1C03", "00CED1", "1569C7", "E78A61"],
        "difficulty": "hard",
        "tip": "Center colors have their 3 first caracters in common, use this to place them"
    },
}

let levelMap = document.getElementById("button-level")
function createLevelMap () {
    let i = 0
    for (let key in LEVELS) {
        let buttonLevel = document.createElement("button")
        
        buttonLevel.classList.add(LEVELS[key].difficulty)
        buttonLevel.classList.add("level")
        buttonLevel.innerText = key
        buttonLevel.onclick = () => {
            play(key)
        }
        levelMap.appendChild(buttonLevel)
        i++
    }
    let buttonLevel = document.createElement("button")
    buttonLevel.id = "coming-soon"
    buttonLevel.innerText = "More level coming soon..."
    buttonLevel.disabled = true
    levelMap.appendChild(buttonLevel)
}

createLevelMap()

// Créer les boutons de niveaux

function play(level="1") {
    document.getElementById("window").style.display = ""
    document.getElementById("window").dataset.level = level
    document.getElementById("tip-button").disabled = true
    disableLevelButton()

    clearInterval(interval)
    clearTimeout(timeout)

    let canva = document.getElementById("canva")
    canva.innerHTML = ""

    // Compte à rebours
    document.getElementById("seconds").innerHTML = `8 seconds`
    let temps = 8
    interval = setInterval(() => {
        temps -= 1
        if (temps <= 0) {
            clearInterval(interval)
        }
        document.getElementById("seconds").innerHTML = `${temps} seconds`
    }, 990 )

    hueAccomplished = generateArrayOfColors(LEVELS[level]["colors"][0], LEVELS[level]["colors"][1], LEVELS[level]["colors"][2], LEVELS[level]["colors"][3], 1)

    let hue = []
    for (let a=0; a<hueAccomplished.length ; a++) {
        hue.push([...hueAccomplished[a]])
    }
    hue = shuffleArray(hue)

    playing = false
    displayArrayOfColors(hueAccomplished)

    timeout = setTimeout(() => { 
        canva.innerHTML = ""
        displayArrayOfColors(hue)
        playing = true
        selectedTiles = {"selection": null}
        document.getElementById('countdown').innerHTML = "The scene is yours, switch the tiles ! <button id='end' onclick='giveUp()'>Give Up ?</button>"
        document.getElementById("tip-button").disabled = false
        document.getElementById("tip-button").onclick = () => {
            showTip(LEVELS)
        }
    }, 8000) // ICI LE COUNTDOWN
}

function giveUp() {
    clearInterval(interval)
    clearTimeout(timeout)

    document.getElementById(`window`).style.display = `none`
    document.getElementById('countdown').innerHTML = `You have only <span class="instructions" id="seconds">8 seconds</span> to memorize the pattern <button id='end' onclick='giveUp()'>Give Up ?</button>`
    ableLevelButton()
}

function disableLevelButton() {
    for (bal of document.querySelectorAll(".level")) {
        bal.disabled = true
    }
}

function ableLevelButton() {
    for (bal of document.querySelectorAll(".level")) {
        bal.disabled = false
    }
}

function showTip(levelBase) {
    let tipDialog = document.getElementById('tip')
    let tip = levelBase[document.getElementById("window").dataset.level]["tip"]
    document.getElementById("tip-p").innerHTML = tip
    tipDialog.showModal()
}

// ----------------------- CSS ----------------------- //

function celebrate () {
    console.log("Well done !")
    // comming soon !
}

let c1CodeH = document.getElementById("c1-code")
let c2CodeH = document.getElementById("c2-code")
let c3CodeH = document.getElementById("c3-code")
let c4CodeH = document.getElementById("c4-code")

let c1Input = document.getElementById('c1')
let c2Input = document.getElementById('c2')
let c3Input = document.getElementById('c3')
let c4Input = document.getElementById('c4')

let allColorLists = [
    [c1CodeH, c1Input],
    [c2CodeH, c2Input],
    [c3CodeH, c3Input],
    [c4CodeH, c4Input]
]

let levelNameInput = document.getElementById('level-name')

function addColorEventListenner() {
    for (let a of allColorLists) {
        a[1].addEventListener('input', () => {
            a[0].innerHTML = a[1].value
        })
        a[1].addEventListener('change', () => {
            a[0].innerHTML = a[1].value
        })
    }
}

addColorEventListenner()

let LEVEL_USER = {}

function createLevel() {
    if (levelNameInput.value == "") {
        alert("Enter a valid name for your level")
        return
    }
    LEVEL_USER[levelNameInput.value] = {
        "colors": [c1Input.value.slice(1).toUpperCase(), c2Input.value.slice(1).toUpperCase(), c3Input.value.slice(1).toUpperCase(), c4Input.value.slice(1).toUpperCase()],
        "difficulty" : "custom",
        "tip": "You created this level ! Enjoy !"
    }
    createCustomLevelMap()
    document.getElementById('create-level-form').style.display = "none"
    levelNameInput.value = ""
}

function openCreateLevelWindow() {
    document.getElementById('create-level-form').style.display = ""
}

let customLevelMap = document.getElementById("button-custom-levels")

function createCustomLevelMap () {
    let i = 0
    customLevelMap.innerHTML = ""
    for (let key in LEVEL_USER) {
        let buttonLevel = document.createElement("button")
        
        buttonLevel.classList.add(LEVEL_USER[key].difficulty)
        buttonLevel.classList.add("level")
        buttonLevel.innerText = key
        buttonLevel.onclick = () => {
            playCustom(key)
        }
        customLevelMap.appendChild(buttonLevel)
        i++
    }
}

createCustomLevelMap()
let customHueAccomplished

function playCustom(level) {

    document.getElementById("window").style.display = ""
    document.getElementById("window").dataset.level = level
    document.getElementById("tip-button").disabled = true
    disableLevelButton()

    clearInterval(interval)
    clearTimeout(timeout)

    let canva = document.getElementById("canva")
    canva.innerHTML = ""

    // Compte à rebours
    document.getElementById("seconds").innerHTML = `8 seconds`

    let temps = 8
    interval = setInterval(() => {
        temps -= 1
        if (temps <= 0) {
            clearInterval(interval)
        }
        document.getElementById("seconds").innerHTML = `${temps} seconds`
    }, 990 )


    customHueAccomplished = generateArrayOfColors(LEVEL_USER[level]["colors"][0], LEVEL_USER[level]["colors"][1], LEVEL_USER[level]["colors"][2], LEVEL_USER[level]["colors"][3], 1)
    let hue = []

    for (let a=0; a<customHueAccomplished.length ; a++) {
        hue.push([...customHueAccomplished[a]])
    }
    hue = shuffleArray(hue)
    playing = false
    displayArrayOfColors(customHueAccomplished)
    timeout = setTimeout(() => { 
        canva.innerHTML = ""
        displayArrayOfColors(hue)
        playing = true
        selectedTiles = {"selection": null}
        document.getElementById('countdown').innerHTML = "The scene is yours, switch the tiles ! <button id='end' onclick='giveUp()'>Give Up ?</button>"
        document.getElementById("tip-button").disabled = false
        document.getElementById("tip-button").onclick = () => {
            showTip(LEVEL_USER)
        }
    }, 8000) // ICI LE COUNTDOWN
}
