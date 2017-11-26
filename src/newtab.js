'use strict';

// from 1989-04-16 up to yesterday
let random_date = function() {
    let rr = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    let start = 577200000000
    let day = 60*60*24*1000
    let date = new Date(rr(start, Date.now()-day))

    let d = date.getDate()
    let m = date.getMonth() + 1
    let y = date.getFullYear()

    if (d < 10) d = `0${d}`
    if (m < 10) m = `0${m}`

    return `${y}-${m}-${d}`
}

let $ = function(t) { return document.querySelector(t) }

let errx = function(err) {
    $('#img').innerHTML = `<b>Error:</b> ${err.message}`
}

let clean = function() {
    ['date', 'img', 'tags', 'desc'].forEach( v => $(`#${v}`).innerHTML = '')
}

let render = function(data) {
    let doc = new DOMParser().parseFromString(data.html, "text/html")
    let div = doc.querySelector('.comic-item-container')
    if (!div) errx(new Error('invalid results from the server'))

    $('#date').innerText = div.dataset.date
    $('#img').innerHTML = `<a href="http://dilbert.com/strip/${data.date}"><img src="${div.dataset.image}"></a>`

    if (div.dataset.tags) {
	$('#tags').innerHTML = div.dataset.tags.split(',').map( tag => {
	    return `<a href="http://dilbert.com/search_results?terms=${encodeURIComponent(tag)}">#${tag}</a>`
	}).join("\n")
    }
    $('#desc').innerText = div.dataset.description
}

let comics_get = async function main() {
    $('#refresh').style.display = 'none'
    $('#img').innerHTML = `<h1>Loading...</h1>`

    let html
    let date = random_date()
    try {
	html = await fetch(`http://dilbert.com/strip/${date}`)
	    .then( r => r.text())
    } catch (e) {
	errx(new Error(`Failed to fetch: ${e}`))
    } finally {
	$('#refresh').style.display = 'inline-block'
	$('#img').innerHTML = ''
    }
    return {html, date}
}

let refresh = function() {
    clean()
    comics_get().then(render)
}

document.addEventListener('DOMContentLoaded', () => {
    $('#refresh').onclick = refresh
    refresh()
})
