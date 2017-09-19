// Massive Darkness Character Tracker

var classes;
var maxHealth = 9;

//jQuery init
$(function () {
	$.get('/resources/classes.json', function (data, status, jqXHR) {
		classes = data.classes;

		$.each(classes, function (key, val) {
			$('.dropdown-menu').append('<li id="'+filterClassName(val.name)+'"><a href="#">' + val.name + '</a></li>')
		});
	}).fail(function () {
		alert("failed to load classes");
	});

	$('#saveCharacter').on('click', function () {
		var savedCharacter = {};
		savedCharacter.name = $('#characterName').val();
		savedCharacter.chosenClass = $("#chosenClass:first-child").text();
		savedCharacter.hp = $('#hp').val();
		savedCharacter.microXp = $('#microXp').val();
		savedCharacter.fullXp = $('#fullXp').val();
		savedCharacter.skills = {};

		download(JSON.stringify(savedCharacter), savedCharacter.name + ".json", "text/json; charset=utf-8");
	});

	$('#loadCharacter').on('change', handleFileSelect);

	$(".dropdown-menu").on('click', 'li', function () {
		$("#chosenClass:first-child").text($(this).text());
		$("#chosenClass:first-child").val($(this).text());

		var chosenClass = undefined;
		for (var i = 0; i < classes.length; ++i) {
			if (classes[i].name === $(this).text()) {
				chosenClass = classes[i];
				break;
			}
		}

		if (chosenClass != undefined) {
			$('#characterSheet').attr('src', '/images/' + chosenClass.characterSheet.image);
		}
	});
});

// replace spaces in the given string
function filterClassName(className){
	return className.replace(/\s+/g, '-');
}

// user is attempting to load a character
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	var loadingCharacter = {};
	var reader = new FileReader();

	reader.onload = function (e) {
		var loadText = e.target.result;
		loadingCharacter = JSON.parse(loadText);

		$('.dropdown-menu #'+filterClassName(loadingCharacter.chosenClass)).trigger('click', loadingCharacter.chosenClass);
		
		$('#microXp').val(loadingCharacter.microXp);
		$('#fullXp').val(loadingCharacter.fullXp);
		$('#hp').val(loadingCharacter.hp);
		$('#characterName').val(loadingCharacter.name);
	};

	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {
		var loadText = reader.readAsText(f);
	}
}

function download(data, filename, type) {
	var file = new Blob([data], {
			type: type
		});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
		url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function onMicroXpUp() {
	var microXp = parseInt($('#microXp').val());
	if (microXp < 5) {
		$('#microXp').val(microXp + 1);
	} else {
		var fullXp = parseInt($('#fullXp').val());
		$('#microXp').val(0);
		$('#fullXp').val(fullXp + 1);
	}
}

function onMicroXpDown() {
	microXp = parseInt($('#microXp').val());
	if (microXp > 0) {
		$('#microXp').val(microXp - 1);
	}
}

function onFullXpUp() {
	var fullXp = parseInt($('#fullXp').val());
	$('#fullXp').val(fullXp + 1)
}

function onFullXpDown() {
	var fullXp = parseInt($('#fullXp').val());

	if (fullXp > 0) {
		$('#fullXp').val(fullXp - 1)
	}
}

function onHpUp() {
	var hp = parseInt($('#hp').val());
	if (hp < maxHealth) {
		$('#hp').val(hp + 1)
	}
}

function onHpDown() {
	var hp = parseInt($('#hp').val());

	if (hp > 0) {
		$('#hp').val(hp - 1)
	}
}
