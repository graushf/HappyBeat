//setInfo(target.textContent, nom_album); //EIIII NOM ALBUM ESTA MALAMENT AL PLAYLIST!
            //nom song (parametre) i que retorni nom_album

//si la 'Song' de la Base de dades té 0 rows -->
                                                    //most populars de spotify o youtube
                                                        //PROVISIONAL: click similar artist amb ""
//si la 'Song' de la Base de dades té rows -->
                                                    //recomana artistes en funció de la bbdd
                                                        //click mostReplayedSongs

//mostReplayedSongs que sigui eventListener

window.onload=function(){
    
jQuery.ajaxSettings.traditional = true; 

var Artist = function (id_artist, name_artist) {
    this.id_artist = id_artist;
    this.name_artist = name_artist;
}

var Album = function (id_album, name_album, url_imatge, firts_song_name) {
    this.id_album = id_album;
    this.name_album = name_album;
    this.url_imatge = url_imatge;
    this.firts_song_name = firts_song_name;
}

var Song = function (id_song, id_artist, id_album, name_song, num_plays) {
    this.id_song = id_song;
    this.id_artist = id_artist;
    this.id_album = id_album;
    this.name_song = name_song;
    this.num_plays = num_plays;
}

var AJAX = {
    request: function(url){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();

        var json_response = xhr.responseText;
        return JSON.parse(json_response);
    }
}

function introduceYoutube(song_title, artist_name) {
    var data = new XMLHttpRequest();
    data.open("GET", "https://www.googleapis.com/youtube/v3/search?part=id%2C+snippet&q=" + song_title +" "+ artist_name + "&key=AIzaSyBaMTRUzKBGkQeGFCAY9yhuz1ke99cCJGs"
, false);
    data.send();
    var json_response_yt = data.responseText;
    var response_yt = JSON.parse(json_response_yt);
    var item = response_yt.items[0];

    $('#video_yt').empty();

    var src = 'http:/youtube.com/embed/' + item.id.videoId;

    var iframe = $("<iframe>");
    iframe.attr('src', src);

    $('#video_yt').append(iframe);

}

var templateSource = document.getElementById('results').innerHTML,

    playingCssClass = 'playing',
    audioObject = null;


var searchInfo = function (query){

    document.getElementById('music').style.display = "none";

    //Cerco Artista!! (canviant type!)
    searchArtist(query,'artist');

    //Cerco Albums d'un artista!! (canviant type!)
    var TotAlbums = searchArtist(query,'album');
    return TotAlbums;

}

var searchArtist = function (query, type){

    var api_url = "https://api.spotify.com/v1/search?query=" + query + "&offset=0&limit=20&type=" + type;

    var resposta = AJAX.request(api_url);

    if (type == 'artist') {

        //creem nou artista amb la resposta que hem optingut de l'api d'spotify
        new_artist = new Artist (resposta.artists.items[0].id, resposta.artists.items[0].name);

        document.getElementById('query').value = new_artist.name_artist;

    }
    if (type == 'album') {

        //tots els albums d'un artista en un array
        var TotAlbums = searchAlbums(resposta, new_artist.id_artist);
        return TotAlbums;
    }

}

var searchAlbums = function (resposta, id_artist){

    var cont = 0;

    var TotAlbums = new Array();

    while (cont < resposta.albums.items.length) {
        firts_song_name = searchSongs(resposta.albums.items[cont].id, id_artist);

        if (resposta.albums.items[cont].images.length == 0) {

            //En cas que l'album no tingues foto es mostrarà una imatge de google "sorry imatge no disponible"
            new_album = new Album (resposta.albums.items[cont].id, resposta.albums.items[cont].name,"http://ozarktech.com/wp-content/uploads/2014/05/image-not-available-grid.jpg", firts_song_name);
        } else {
            new_album = new Album (resposta.albums.items[cont].id, resposta.albums.items[cont].name,resposta.albums.items[cont].images[0].url, firts_song_name);
        }
        
        //inserim el new_album a l'array d'albums
        TotAlbums.push(new_album);

        cont ++;
    }

    printa(TotAlbums);

    return TotAlbums;
}

var printa = function (TotAlbums) {

    var cont = 0;

    while (cont < TotAlbums.length) {

        var div = $("<div>");
        div.addClass('artist');

        var img = $("<img>");
        img.attr('src', TotAlbums[cont].url_imatge);
        img.attr('id',TotAlbums[cont].id_album);
        img.attr('class','cover');

        div.append($("<h2>").text(TotAlbums[cont].name_album));
        div.append(img);
        
        $("#results").append(div);

        cont ++;
    }

}

var searchSongs = function (id_album, id_artist){
    var api_url = "https://api.spotify.com/v1/albums/" + id_album + "/tracks";

    var resposta = AJAX.request(api_url);

    var album_songs = new Array ();

    var cont2 = 0;

    while (cont2 < resposta.items.length) {

        //new_song amb els mateixos elements que tenim a la bbdd, rebuts de l'api d'spotify
        new_song = new Song (resposta.items[cont2].id, id_artist, id_album, resposta.items[cont2].name, 0);
        
        album_songs.push(new_song);

        cont2 ++;
    }

    return resposta.items[0].name;
}

var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};

var getArtistId = function () {
 return albumId;   
}


array_songs_pv = new Array();

var setInfo = function(song_name, album_name){

    document.getElementById('title').innerText = song_name;

    document.getElementById('artist').innerText = document.getElementById('query').value;

    document.getElementById('album').innerText = album_name;

    //per controlar el css
    document.getElementById('cd').style.display = "block";
    document.getElementById('title').style.display = "block";
    document.getElementById('artist').style.display = "block";
    document.getElementById('album').style.display = "block";
    document.getElementById('list').style.display = "block";

}

var setPlaylist = function() {
    var cont = 0;

    $('#list').empty();

    while (cont < array_songs_pv.length) {
                
        $('#list').append($("<h2>").text(array_songs_pv[cont].title));
        
        cont ++;
    }

}

var printa2 = function (TotAlbums) {

    var cont = 0;

    while (cont < TotAlbums.length) {

        var div = $("<div>");
        div.addClass('artistPopular');

        var img = $("<img>");
        img.attr('src', TotAlbums[cont].url_imatge);
        img.attr('id',TotAlbums[cont].id_album);
        img.attr('class','coverPopular');

        div.append($("<h2>").text(TotAlbums[cont].titol_song));
        div.append(img);
        
        $("#results").append(div);

        cont ++;
    }

}

//deteccio de click a la playlist
document.getElementById("list").addEventListener("click", function(e) {
    
    var target = e.target;

    var cont = 0;

    var boolea_play = 0;

    while (cont < array_songs_pv.length) {


        if (array_songs_pv[cont].title === target.textContent) {

            var pos_array = cont;

        }

        array_songs_pv[cont].pause();

        cont ++;
    }
    
    if (target !== null && target.tagName === 'H2') {

        if (target.classList.contains(playingCssClass)) {
            array_songs_pv[pos_array].pause();
        } else {
            if (array_songs_pv[pos_array]) {
                array_songs_pv[pos_array].pause();
            }

            var nom_artista = data.searchArtistNameBySongName(array_songs_pv[pos_array].title);

            introduceYoutube(target.textContent, nom_artista);


            var nom_album = data.searchAlbumNameBySongName(target.textContent);

            setInfo(target.textContent, nom_album);

            array_songs_pv[pos_array].play();

            //num reproduccions ++;
            data.updateSongByName(array_songs_pv[pos_array].title);

            target.classList.add(playingCssClass);
            array_songs_pv[pos_array].addEventListener('ended', function() {
                target.classList.remove(playingCssClass);
            });
            array_songs_pv[pos_array].addEventListener('pause', function() {
                target.classList.remove(playingCssClass);
           });
      }
    }

});

//deteccio de click a la llista de cançons d'un album
document.getElementById("player").addEventListener("click", function(e) {
    var target = e.target;

    var id_album = document.getElementById('cd').alt;

    if (target !== null && target.tagName === 'H2') {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }

            fetchTracks(id_album, function(data) {

                audioObject = new Audio(data.tracks.items[target.id].preview_url);

                introduceYoutube(data.tracks.items[target.id].name, document.getElementById('query').value);

                setInfo(data.tracks.items[target.id].name, data.name);

                audioObject.play();

                audioObject.title = data.tracks.items[target.id].name;

                array_songs_pv.push(audioObject);

                setPlaylist();

                //insercio a la bbdd
                repro.introducirRepro(data.tracks.items[target.id].name, $('#artist').html(), $('#album').html(), document.getElementById('cd').src);

                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function() {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function() {
                    target.classList.remove(playingCssClass);
               });
            });
      }
    }

});

//BBDD - Objeto para guardar informacion de cancion, album i artista seleccionado por usuario
var repro = {
    introducirRepro : function(song, artist, album, url) {

        dataTemp.enterInArrayRepros(song, artist, album, url);
        data.save(dataTemp.getSong(), dataTemp.getArtist(), dataTemp.getAlbum(), dataTemp.getUrl());
        dataTemp.deleteArrayContent();
    }
}

//deteccio de click per la cerca d'un artista pels seus albums
results.addEventListener('click', function(e) {

    var target = e.target;

    var id_album = target.getAttribute('id');
    
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            
            fetchTracks(target.getAttribute('id'), function(data) { 

                audioObject = new Audio(data.tracks.items[0].preview_url);

                var cont = 0;

                $("div").remove(".album_seleccionat");

                var div = $("<div>");

                div.addClass('album_seleccionat');

                while (cont < data.tracks.items.length) {

                    var nom_canso = $("<h2>").text(data.tracks.items[cont].name);
                    nom_canso.attr('id',cont);

                    div.append(nom_canso);

                    var info = $("<h3>").text("Click play and pause again");      
                    info.addClass('info');

                    div.append(info);
                     
                    cont ++;
                }

                $('#player').append(div);

                introduceYoutube(data.tracks.items[0].name, document.getElementById('query').value);

                setInfo(data.tracks.items[0].name, data.name);       

                audioObject.play();

                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function() {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function() {
                    target.classList.remove(playingCssClass);
               });
            });

            var imatge_act =  document.getElementById('cd');
            imatge_act.src = target.src;
            imatge_act.alt = id_album;

        }
    }

    if (target !== null && target.classList.contains('coverPopular')) {
        if (target.classList.contains(playingCssClass)) {
        } else {
            console.log(target);

            var cont = 0;

            while (cont < TotAlbums.length) {
                if (TotAlbums[cont].id_album === target.id) {
                    var titol_song = TotAlbums[cont].titol_song;
                    var nom_artista = TotAlbums[cont].Nom_artista;
                }
                cont ++;
            }
            introduceYoutube(titol_song, nom_artista);
   
        }
    }




});



var config = getConfig();

function fetchSimilarArtists(artist, callback) {
    var url = config.echoNestHost + 'api/v4/artist/similar';
    $("#results").empty();
    $.getJSON(url, { 
            'api_key': config.apiKey,
            'id' : artist.id,
            'bucket': [ 'id:' + config.spotifySpace], 
            'limit' : true,
          }) 
        .done(function(data) {
            if (data.response.status.code == 0 && data.response.artists.length > 0) {
                callback(data.response.artists);
            }
        })
}

function getBestImage(images, minSize) {
    var best = null;
    if (images.length > 0) {
        best = images[0];
        images.forEach(
            function(image) {
                if (image.width >= minSize) {
                    best = image;
                }
            }
        );
    }
    return best;
}

function getArtistDiv(artist) {
    var image = getBestImage(artist.spotifyArtistInfo.images, 600);
    if (image) {
        var adiv = $("<div>");
        adiv.addClass('artist');
        adiv.append($("<h2>").text(artist.name));
        var img = $("<img>");
        img.attr('src', image.url);
        adiv.append(img);
        img.on('click', function() {
            $("#query").val(artist.name);
            fetchSimilarArtists(artist, function(similars) {
                fetchSpotifyImagesForArtists(similars, function(similars) {
                    showArtists(artist, similars);
                });
            });
        });
        return adiv;
    } else {
        return null;
    }
}

function fetchSpotifyImagesForArtists(artists, callback) {
    var fids = [];
    artists.forEach(function(artist) {
        fids.push(fidToSpid(artist.foreign_ids[0].foreign_id));
    });

    $.getJSON("https://api.spotify.com/v1/artists/", { 'ids': fids.join(',')}) 
        .done(function(data) {
            data.artists.forEach(function(sartist, which) {
                artists[which].spotifyArtistInfo = sartist;
            });
            callback(artists);
        })

}


function showSimilars(seed, similars) {
    similars.forEach(function(similar) {
        var simDiv = getArtistDiv(similar);
        if (simDiv) {
            $("#results").append(simDiv);
        }
    });    
}

function searchSimilarArtist(name, callback) {
    var url = config.echoNestHost + 'api/v4/artist/search';
    $("#results").empty();

    $.getJSON(url, {
            'api_key': config.apiKey,
            'name' : name,
            'bucket': [ 'id:' + config.spotifySpace], 
            'limit' : true,
          }) 
        .done(function(data) {
            callback(data);
        })
        .error( function() {
        }) ;
}

function newArtist() {
    var artist = $("#query").val();

    searchSimilarArtist(artist, function(data) {
        if (data.response.status.code == 0 && data.response.artists.length > 0) {
            var seed = data.response.artists[0];
            fetchSpotifyImagesForArtists([seed], function(seeds) {
                fetchSimilarArtists(seeds[0], function(similars) {
                    fetchSpotifyImagesForArtists(similars, function(similars) {
                        showSimilars(seed, similars);
                    });
                });
            });
        }
    });
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();

    //Perque inicialment estiqui buit el div de mostrar els albums de lartista escollit
    $("#results").empty();

    var TotAlbums = searchInfo(document.getElementById('query').value);

}, false);

$(document).ready(function() {
    $("#artistasRel").on("click", function() {
        document.getElementById('music').style.display = "none";
        newArtist();
    });

    $('#link_populars').on('click', function() {
        document.getElementById('music').style.display = "none";

        putMostReplayed();

    });
});

//BBDD. Objeto para guardar información temporal del usuario y facilitar el put a la bbdd
var dataTemp = new Object();
dataTemp.arrayRepros = new Array();
dataTemp.enterInArrayRepros = function(song,artist,album,url) {
    this.arrayRepros[0] = {"song" : song, "artist" : artist, "album" : album, "url" : url};
}

dataTemp.deleteArrayContent = function() {
    this.arrayRepros.pop();
}
dataTemp.getSong = function() {
    return this.arrayRepros[0].song;
}
dataTemp.getArtist = function() {
    return this.arrayRepros[0].artist;

}
dataTemp.getAlbum = function() {
    return this.arrayRepros[0].album;

}
dataTemp.getUrl = function() {
    return this.arrayRepros[0].url;
}

//BBDD. Objeto para conectarse mediante AJAX a la BD
var AJAXtoDB = {
    request: function(url,query){
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, false);
        xhr.send(query);

        var response = xhr.responseText;
        var resp = JSON.parse(response);
        return(resp);
    }
}

//BBDD. Objeto Data que hace el PUT al Serivdor. Permite conseguir toda la informacion de
//la BBDD que guarda en tres arrays, uno para todas canciones, otro para todos los albumes y otro 
//para todos los artistas.
//Tiene un metodo de insercion de toda la informacion en la base de datos y modificacion de alguna 
//si es necesario.
//Finalmente tiene un metodo que recupera las canciones mas reproducidas por el usuario, se le pasa 
//por parametros el limite de canciones que escojer.
var data = new Object();
data.urlXhr = "http://api.hipermedia.local/query";
data.arraySongs = new Array();
data.arrayAlbums = new Array();
data.arrayArtists = new Array();
data.arrayMostRepeatedSongs = new Array();
data.arrayMostRepeatedSongsExtraInfo = new Array();

data.get = function() {
    var result;
    var query = 'SELECT * FROM Album';
    result = searchAlbum(this.urlXhr, query);
    for(var i=0; i<result.length;i++){
        this.arrayAlbums[i] = {"Id_album" : result[i].Id_album, "titol_album" : result[i].titol_album, "url_imatge" : result[i].url_imatge};
    }
    
    var query = 'SELECT * FROM Artist';
    result = searchArtists(this.urlXhr, query);
    for(var i=0; i<result.length;i++){
        this.arrayArtists[i] = {"Id_artista" : result[i].Id_artista, "nom_artista" : result[i].Nom_artista};
    }
    var query = 'SELECT * FROM Song';
    result = searchSongs(this.urlXhr, query);
    for(var i=0; i<result.length;i++){
        this.arraySongs[i] = {"Id_song" : result[i].Id_song, "titol_song" : result[i].titol_song, "num_reproduccions" : result[i].num_reproduccions};
    }

    
    function searchAlbum(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);

        if(resp.response.length === 0){
            return false;
        }else{
            var albums = resp.response;
            return albums;
        }
    };

    function searchArtists(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);

        if(resp.response.length === 0){
            return false;
        }else{
            var artists = resp.response;
            return artists;
        }
    };
    function searchSongs(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);

        if(resp.response.length === 0){
            return false;
        }else{
            var songs = resp.response;
            return songs;
        }
    };

}
//BBDD
// Como mysql no permite busvar por accentos o hacer insert con palabras con accentos he usado esta funcion 
//sacada de: http://stackoverflow.com/questions/286921/efficiently-replace-all-accented-characters-in-a-string
//ENTRADA 8 / 10-01-2015
String.prototype.stripAccents = function() {
    var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
    var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    return (this.replace(translate_re, function(match){
        return translate.substr(translate_re.source.indexOf(match)-1, 1); })
    );
};

data.save = function(song, artist, album, url) {

    song = song.stripAccents();
    artist = artist.stripAccents();
    album = album.stripAccents();


    var result;
    var query = 'SELECT * FROM Album WHERE Album.titol_album = "'+album+'"';
    result = searchAlbum(this.urlXhr, query);
    if(result === false){  

        query = 'INSERT INTO Album VALUES ("","'+url+'","'+album+'")';
        insertAlbum(this.urlXhr, query);
        query = 'SELECT * FROM Album WHERE Album.titol_album = "'+album+'"';
        result = searchAlbum(this.urlXhr, query);
        var id_album = result;

    }else{
        var id_album = result;
    }
    query = 'SELECT * FROM Artist WHERE Artist.Nom_artista= "'+artist+'"';
    result = searchArtist(this.urlXhr, query);
    if(result === false){
        query = 'INSERT INTO Artist VALUES ("","'+artist+'")';
        insertArtist(this.urlXhr, query);      
        query = 'SELECT * FROM Artist WHERE Artist.Nom_artista= "'+artist+'"';
        result = searchArtist(this.urlXhr, query);
        var id_artista = result;
    }else{
        var id_artista = result;
    }
        
    var query = 'SELECT * FROM Song WHERE Song.titol_song= "'+song+'"';
    result = searchSong(this.urlXhr, query);
    if(result === false){
        query = 'INSERT INTO Song VALUES ("","'+song+'",'+1+')';
        insertSong(this.urlXhr, query);
        var query = 'SELECT * FROM Song WHERE Song.titol_song= "'+song+'"';
        result = searchSong(this.urlXhr, query);
        var id_song = result;
    }else{
        var id_song = result;
        var query = 'SELECT * FROM Song WHERE Song.titol_song= "'+song+'"';
        result = searchSongNumRepros(this.urlXhr, query);
        var num_repros = result;
        num_repros = parseInt(num_repros);
        num_repros = num_repros + 1;

        query = 'UPDATE Song SET num_reproduccions ='+num_repros+' WHERE Id_song='+id_song;
        updateSong(this.urlXhr, query);
    }

    var query = 'INSERT INTO Relation VALUES ("",'+id_album+","+id_artista+","+id_song+")"
    insertRelation(this.urlXhr, query);

    function searchAlbum(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);

        if(resp.response.length === 0){
            return false;
        }else{
            var id_album = resp.response[0].Id_album;
            return id_album;
        }
    };
    function insertAlbum(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };


    function searchArtist(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        if(resp.response.length === 0){
            return false;
        }else{
            var id_artist = resp.response[0].Id_artista;
            return id_artist;
        }
    };


    function insertArtist(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };



    function searchSong(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        if(resp.response.length === 0){
            return false;
        }else{
            var id_song = resp.response[0].Id_song;
            return id_song;
        }
    };


    function searchSongNumRepros(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        if(resp.response.length === 0){
            return false;
        }else{
            var num_repros = resp.response[0].num_reproduccions;
            return num_repros;
        }
    };



    function insertSong(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };



    function updateSong(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };

    function insertRelation(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };



}

data.getMostRepeatedSongs = function(limit) {
    
    var query = 'SELECT * FROM Song ORDER BY num_reproduccions DESC LIMIT '+limit;
    result = searchSongs(this.urlXhr, query);
    for(var i=0; i<result.length;i++){
        this.arrayMostRepeatedSongs[i] = {"Id_song" : result[i].Id_song, "titol_song" : result[i].titol_song, "num_reproduccions" : result[i].num_reproduccions};
    }
    function searchSongs(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        if(resp.response.length === 0){
            return false;
        }else{
            var songs = resp.response;
            return songs;
        }
    };
    
}

//Metodo que suma 1 al numero de veces que se ha reproducido una cancion solo pasandole el nombre de la cancion
data.updateSongByName = function(song_name) {
    var query = 'SELECT num_reproduccions FROM Song WHERE Song.titol_song="'+song_name+'"';
    numRepros = searchSong(this.urlXhr, query);
    numRepros = parseInt(numRepros) + 1;
    query = 'UPDATE Song SET num_reproduccions = '+numRepros+' WHERE Song.titol_song= "'+song_name+'"';
    updateSong(this.urlXhr, query);
    
    function searchSong(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        console.log(resp);
        var num_repros = resp.response[0].num_reproduccions;
        return num_repros;
        
    };

    function updateSong(urlXhr, query) {
        AJAXtoDB.request(urlXhr,query);
    };
}



/*
Metode de data que passantli el titol d'una canço et retorni el nom del artista.
*/
//Metodo que devuelve el nombre del artista que reproducde una cancion pasada por parametros
data.searchArtistNameBySongName = function(song_name) {
    var query = 'SELECT DISTINCT Artist.Nom_artista FROM Artist, Song, Album, Relation WHERE Song.titol_song ="'+song_name+ '" AND Song.Id_song = Relation.Id_song AND Relation.Id_artista = Artist.Id_artista';
    console.log(query);
    var nom_artist = searchSong(this.urlXhr, query);
    
    return(nom_artist);

    function searchSong(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        console.log(resp);
        console.log(resp.response.length );
        
        var nom_artista = resp.response[0].Nom_artista;
        return nom_artista;
        
    };
}

//Metodo que devuelve el nombre del album en funcion del parametro song_name
data.searchAlbumNameBySongName = function(song_name) {
    var query = 'SELECT DISTINCT Album.titol_album FROM Album, Song, Artist, Relation WHERE Song.titol_song ="'+song_name+ '" AND Song.Id_song = Relation.Id_song AND Relation.Id_album = Album.Id_album';

    console.log(query);
    var nom_artist = searchSong(this.urlXhr, query);
    
    return(nom_artist);

    function searchSong(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        console.log(resp);
        console.log(resp.response.length );
        
        var titol_album = resp.response[0].titol_album;
        return titol_album;
        
    };
}

data.getMostRepeatedSongsExtraInfo = function(limit) {
    var query = 'SELECT DISTINCT titol_song, titol_album, Album.Id_album, url_imatge, Nom_artista FROM Song, Album, Artist, Relation WHERE Song.Id_song = Relation.Id_song AND Relation.Id_artista = Artist.Id_artista AND Relation.Id_album = Album.Id_album ORDER BY num_reproduccions DESC LIMIT '+limit;
    result = searchSongs(this.urlXhr, query);
    for(var i=0; i<result.response.length;i++){
        this.arrayMostRepeatedSongsExtraInfo[i] = {"titol_song" : result.response[i].titol_song, "name_album" : result.response[i].titol_album, "id_album" : result.response[i].Id_album, "url_imatge" : result.response[i].url_imatge, "Nom_artista" : result.response[i].Nom_artista};
    }

    function searchSongs(urlXhr, query) {
        var resp = AJAXtoDB.request(urlXhr,query);
        if(resp.response.length === 0){
            return false;
        }else{
            return resp;
        }
    };

}

function putMostReplayed() {

    var limit = 0;

    data.get();
    if(data.arraySongs.length > 20) {
        limit = 20;
    }else{
        if(data.arraySongs.length > 10){
            limit = 10;
        }else{
            limit = 5;
        }
    }

    data.getMostRepeatedSongs(limit);
    data.getMostRepeatedSongsExtraInfo(limit);

    TotAlbums = data.arrayMostRepeatedSongsExtraInfo;

    $("#results").empty();

    printa2(TotAlbums);

}

}