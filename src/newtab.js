'use strict';

/* global Mustache */

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

let comic_fetch = function() {
    let date = random_date()
    return fetch(`http://dilbert.com/strip/${date}`)
	.then( r => r.text())
	.then( text => ({date, text}))
}

let comic_parse = function(comic) {
    let doc = new DOMParser().parseFromString(comic.text, "text/html")
    let div = doc.querySelector('.comic-item-container')
    if (!div) throw new Error('invalid results from the server')

    return {
	title: div.dataset.date,
	date: comic.date,
	img: div.dataset.image,
	tags: div.dataset.tags.split(',')
	    .filter( v => v.length).map( v => ({
		url_comp: encodeURIComponent(v),
		name: v
	    })),
	desc: div.dataset.description
    }
}

let $ = function(t) { return document.querySelector(t) }

let render = function(view) {
    $('#app').innerHTML = Mustache.render($('#page').innerHTML, view)
    $('#refresh').onclick = refresh
}

let msg = function(t) {
    $('#app').innerHTML = Mustache.render($('#msg').innerHTML, {msg: t})
}

let refresh = function() {
    msg('Fetching...')
    comic_fetch().then(comic_parse).then(render).catch(msg)
}

document.addEventListener('DOMContentLoaded', refresh)
