var app = angular.module("nesEditor", []);

app.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
});

app.controller("nesEditorController", function($scope) {

  $scope.project_name = "project_name";

  $scope.loading = 0;
  $scope.main_colors = [
    {r: 127, g: 127, b: 127, hex:  "0"},
    {r:   0, g:  61, b: 165, hex:  "1"},
    {r:   0, g:  18, b: 175, hex:  "2"},
    {r:  67, g:   0, b: 149, hex:  "3"},
    {r: 161, g:   0, b:  93, hex:  "4"},
    {r: 199, g:   0, b:  39, hex:  "5"},
    {r: 186, g:   5, b:   0, hex:  "6"},
    {r: 139, g:  22, b:   0, hex:  "7"},
    {r:  91, g:  47, b:   0, hex:  "8"},
    {r:  15, g:  68, b:   0, hex:  "9"},
    {r:   5, g:  73, b:   0, hex:  "a"},
    {r:   0, g:  71, b:  45, hex:  "b"},
    {r:   0, g:  64, b: 101, hex:  "c"},
    {r:   0, g:   0, b:   0, hex:  "d"},
    {r:   5, g:   5, b:   5, hex:  "e"},
    {r:   5, g:   5, b:   5, hex:  "f"},
    {r: 199, g: 199, b: 199, hex: "10"},
    {r:   0, g: 119, b: 255, hex: "11"},
    {r:  32, g:  84, b: 255, hex: "12"},
    {r: 129, g:  54, b: 250, hex: "13"},
    {r: 235, g:  47, b: 180, hex: "14"},
    {r: 255, g:  41, b:  79, hex: "15"},
    {r: 255, g:  33, b:   0, hex: "16"},
    {r: 213, g:  49, b:   0, hex: "17"},
    {r: 195, g:  97, b:   0, hex: "18"},
    {r:  53, g: 127, b:   0, hex: "19"},
    {r:   5, g: 142, b:   0, hex: "1a"},
    {r:   0, g: 137, b:  84, hex: "1b"},
    {r:   0, g: 152, b: 204, hex: "1c"},
    {r:  32, g:  32, b:  32, hex: "1d"},
    {r:   9, g:   9, b:   9, hex: "1e"},
    {r:   9, g:   9, b:   9, hex: "1f"},
    {r: 255, g: 255, b: 255, hex: "20"},
    {r:  15, g: 215, b: 255, hex: "21"},
    {r: 104, g: 162, b: 255, hex: "22"},
    {r: 212, g: 127, b: 255, hex: "23"},
    {r: 255, g:  68, b: 243, hex: "24"},
    {r: 255, g:  96, b: 139, hex: "25"},
    {r: 255, g: 135, b:  50, hex: "26"},
    {r: 255, g: 155, b:  18, hex: "27"},
    {r: 250, g: 187, b:  32, hex: "28"},
    {r: 158, g: 227, b:  13, hex: "29"},
    {r:  42, g: 240, b:  53, hex: "2a"},
    {r:  12, g: 240, b: 163, hex: "2b"},
    {r:   5, g: 251, b: 255, hex: "2c"},
    {r:  93, g:  93, b:  93, hex: "2d"},
    {r:  12, g:  12, b:  12, hex: "2e"},
    {r:  12, g:  12, b:  12, hex: "2f"},
    {r: 255, g: 255, b: 255, hex: "30"},
    {r: 165, g: 252, b: 255, hex: "31"},
    {r: 179, g: 236, b: 255, hex: "32"},
    {r: 218, g: 171, b: 235, hex: "33"},
    {r: 255, g: 167, b: 249, hex: "34"},
    {r: 255, g: 171, b: 179, hex: "35"},
    {r: 255, g: 210, b: 175, hex: "36"},
    {r: 255, g: 239, b: 165, hex: "37"},
    {r: 255, g: 247, b: 155, hex: "38"},
    {r: 215, g: 232, b: 148, hex: "39"},
    {r: 165, g: 237, b: 174, hex: "3a"},
    {r: 162, g: 242, b: 218, hex: "3b"},
    {r: 152, g: 255, b: 252, hex: "3c"},
    {r: 221, g: 221, b: 221, hex: "3d"},
    {r:  17, g:  17, b:  17, hex: "3e"},
    {r:  17, g:  17, b:  17, hex: "3f"}
  ];

  $scope.sprites = new2DArray(16, 16);
  $scope.backgrounds = new2DArray(16, 16);
  $scope.tiles = {
    sprite: $scope.sprites,
    background: $scope.backgrounds
  };
  $scope.clipboard = null;

  for (var x = 0; x < 16; x++) {
    for (var y = 0; y < 16; y++) {
      $scope.sprites[x][y] = new2DArray(8, 8, 0);
      $scope.backgrounds[x][y] = new2DArray(8, 8, 0);
    }
  }

  $scope.nametables = [
    new2DArray(32, 30, 0),
    new2DArray(32, 30, 0)
  ];

	$scope.attribute_tables = [
    new2DArray(8, 8, new2DArray(2, 2, 0)),
    new2DArray(8, 8, new2DArray(2, 2, 0))
  ];

  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      $scope.attribute_tables[0][x][y] = new2DArray(2, 2, 0);
      $scope.attribute_tables[1][x][y] = new2DArray(2, 2, 0);
    }
  }

  $scope.attribute_tables[0][3][4][1][1] = 1;

  $scope.active_tile_x = 0;
  $scope.active_tile_y = 0;

  $scope.undos = [];
  $scope.redos = [];

  $scope.choose_color = false;

  $scope.chooseColor = function() {
    $scope.choose_color = !$scope.choose_color;
  }

  $scope.selected_palette = {sprite: 0, background: 0};
  $scope.selected_color = 1;

  $scope.tab = "sprite";

  $scope.palettes = {
    sprite:
    [
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"]
    ],
    background:
    [
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"],
      [ "f",
       "30",
       "30",
       "30"]
     ]
  };

  function loadLastState() {
    var last_state = localStorage.getItem("last_state");

    if (last_state !== null) {
      try {
        loadState(JSON.parse(last_state));
      }
      catch (err) {
        localStorage.removeItem("last_state");
        location.reload();
      }
    }
    else {
      localStorage.setItem("last_state", JSON.stringify(getState()));
    }
  }

  loadLastState();

  function getState() {
    return JSON.parse(JSON.stringify({
      sprites: $scope.sprites,
      backgrounds: $scope.backgrounds,
      active_tile_x: $scope.active_tile_x,
      active_tile_y: $scope.active_tile_y,
      nametables: $scope.nametables,
      attribute_tables: $scope.attribute_tables,
      selected_palette: $scope.selected_palette,
      selected_color: $scope.selected_color,
      tab: $scope.tab,
      palettes: $scope.palettes,
      project_name: $scope.project_name
    }));
  }

  function saveState() {
    var state = getState();
    $scope.undos.push(state);
    $scope.redos = [];
    if ($scope.undos.length > 100) {
      $scope.undos.splice(0, 1);
    }
  }

  function saveToStorage() {
    localStorage.setItem("last_state", JSON.stringify(getState()));
  }

  function loadState(state) {

    $scope.sprites = state.sprites;
    $scope.backgrounds = state.backgrounds;
    $scope.tiles = {sprite: $scope.sprites, background: $scope.backgrounds};
    $scope.active_tile_x = state.active_tile_x;
    $scope.active_tile_y = state.active_tile_y;
    $scope.nametables = state.nametables;
    $scope.attribute_tables = state.attribute_tables;
    $scope.selected_palette = state.selected_palette;
    $scope.selected_color = state.selected_color;
    $scope.tab = state.tab;
    $scope.palettes = state.palettes;
    $scope.project_name = state.project_name;
  }

  $scope.undo = function() {
    $scope.redos.push(getState());
    loadState($scope.undos[$scope.undos.length - 1]);
    $scope.undos.splice($scope.undos.length - 1, 1);
  };
  $scope.redo = function() {
    $scope.undos.push(getState());
    loadState($scope.redos[$scope.redos.length - 1]);
    $scope.redos.splice($scope.redos.length - 1, 1);
  };

  $scope.getNumbers = function(number) {
    return ["%"+number.toString(2), number, "$"+number.toString(16).toUpperCase()];
  };

  $scope.changeTab = function(new_tab) {
    $scope.tab = new_tab;
  };

  $scope.getActiveNametable = function() {
    return parseInt($scope.tab.substr(-1)) - 1;
  };

  angular.element(document).ready(function () {

    var file_uploads = document.getElementsByClassName('file-upload');
    for (var i = 0; i < file_uploads.length; i++) {
      let file_upload = file_uploads[i];

      file_upload.addEventListener('change', function() {

        $scope.loading = this.files.length;
        $scope.$apply();

        for (var i = 0; i < this.files.length; i++) {
          var reader = new FileReader();

          reader.onload = function(event) {
            var fileName = event.target.fileName;
            var binaryString = this.result;
            if (file_upload.id === 'sprite-upload') {
              loadTiles(stringToBytes(binaryString), false);
            }
            else if (file_upload.id === 'background-upload') {
              loadTiles(stringToBytes(binaryString), true);
            }
            else if (file_upload.id === 'palette-upload') {
              loadPalettes(stringToBytes(binaryString));
            }
            else if (file_upload.id === 'nametable-upload') {
              loadNametable(stringToBytes(binaryString));
            }
            $scope.loading--;
            $scope.$apply();
          };

          reader.fileName = this.files[i].name;
          reader.readAsBinaryString(this.files[i]);
        }
        file_upload.value = "";
      }, false);
    }
  });

  var saveByteArray = (function () {

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    return function(data, fileName) {
      var out_data = new Uint8Array(data.length);
      for (var i = 0; i < data.length; i++) {
        out_data[i] = data[i];
      }
      var blob = new Blob([out_data], {type: "text/plain"});
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }());

  $scope.savePalette = function(name) {

    var bytes = [];

    for (var i = 0; i < 32; i++) {

      var palette_index
      var palette;

      if (i < 16) {
        palette = "background";
        palette_index = 0;
      }
      else {
        palette = "sprite";
        palette_index = 1;
      }

      var subpalette_index = Math.floor((i - palette_index*16)/4);
      var color_index = i % 4;
      bytes.push(parseInt($scope.palettes[palette][subpalette_index][color_index], 16));
    }
    saveByteArray(bytes, name+".pal");
  };

  $scope.saveTiles = function(name, background) {

    var tiles = $scope.sprites;
    var extension = ".spr";
    if (background) {
      tiles = $scope.backgrounds;
      extension = ".bkg";
    }

    var bytes = [];

    for (var tile_y = 0; tile_y < 16; tile_y++) {
      for (var tile_x = 0; tile_x < 16; tile_x++) {

          var tile = tiles[tile_x][tile_y];

          var first_layer = [];
          var second_layer = [];

          for (var y = 0; y < 8; y++) {
            var binary_string_1 = "";
            var binary_string_2 = "";

            for (var x = 0; x < 8; x++) {
              var pixel = tile[x][y];

              if (pixel === 0) {
                binary_string_1 += "0";
                binary_string_2 += "0";
              }
              else if (pixel === 1) {
                binary_string_1 += "1";
                binary_string_2 += "0";
              }
              else if (pixel === 2) {
                binary_string_1 += "0";
                binary_string_2 += "1";
              }
              else if (pixel === 3) {
                binary_string_1 += "1";
                binary_string_2 += "1";
              }
            }
            first_layer.push(parseInt(binary_string_1, 2));
            second_layer.push(parseInt(binary_string_2, 2));
          }
          for (var j = 0; j < first_layer.length; j++) {
            bytes.push(first_layer[j]);
          }
          for (var j = 0; j < second_layer.length; j++) {
            bytes.push(second_layer[j]);
          }
      }
    }
    saveByteArray(bytes, name+extension);
  };

  $scope.saveNametable = function(name) {
    var bytes = [];
    var table_index = $scope.tab === 'nametable1' ? 0 : 1;

  	for (var y = 0; y < 30; y++) {
  		for (var x = 0; x < 32; x++) {
  			bytes.push($scope.nametables[table_index][x][y]);
  		}
  	}

  	for (var y = 0; y < 8; y++) {
  		for (var x = 0; x < 8; x++) {
  			var value = 0;

  			value = value | $scope.attribute_tables[table_index][x][y][0][0];
  			value = value | $scope.attribute_tables[table_index][x][y][1][0] << 2;
  			value = value | $scope.attribute_tables[table_index][x][y][0][1] << 4;
  			value = value | $scope.attribute_tables[table_index][x][y][1][1] << 6;

      	bytes.push(value);
  		}
  	}

    var number = parseInt($scope.tab.substr(-1));
    var part = 1;

    var out = [];

    for (var i = 0; i < bytes.length; i++) {
      out.push(bytes[i]);

      if (out.length === 256) {
        saveByteArray(out, name+"_"+number+"_"+part+".ntpart");
        out = [];
        part++;
      }
    }
  	saveByteArray(bytes, name+"_"+number+".nt");
  };

  function stringToBytes(input) {
    var out = [];
    for (var i = 0; i < input.length; i++) {
      out.push(input.charCodeAt(i));
    }
    return out;
  }

  function loadPalettes(input) {
    saveState();
    for (var i = 0; i < input.length; i++) {

      var palette_index
      var palette;

      if (i < 16) {
        palette = "background";
        palette_index = 0;
      }
      else {
        palette = "sprite";
        palette_index = 1;
      }

      var subpalette_index = Math.floor((i - palette_index*16)/4);
      var color_index = i % 4;

      $scope.palettes[palette][subpalette_index][color_index] = $scope.main_colors[input[i]].hex;
    }
    $scope.$apply();
    saveToStorage();
  }

  function loadTiles(input, background) {
    saveState();
    for (var i = 0; i < input.length; i += 16) {
			var n = i/16;              //n-th block of 16 bytes
			var y = Math.floor(n/16);  //row
			var x = n-y*16;            //col

      var first_layer = [
        input[i+0+0],
        input[i+0+1],
        input[i+0+2],
        input[i+0+3],
        input[i+0+4],
        input[i+0+5],
        input[i+0+6],
        input[i+0+7]
      ];

      var second_layer = [
        input[i+8+0],
        input[i+8+1],
        input[i+8+2],
        input[i+8+3],
        input[i+8+4],
        input[i+8+5],
        input[i+8+6],
        input[i+8+7]
      ];

      if (background) {
        $scope.backgrounds[x][y] = tileFrom(first_layer, second_layer);
      }
      else {
        $scope.sprites[x][y] = tileFrom(first_layer, second_layer);
      }
      $scope.$apply();
      saveToStorage();
    }
  }

  function loadNametable(bytes) {
    saveState();
    var table_index = $scope.tab === 'nametable1' ? 0 : 1;

  	for (var i = 0; i < 960; i++) {

  		var x = i % 32;
  		var y = Math.floor(i / 32);

  		$scope.nametables[table_index][x][y] = bytes[i];
  	}

  	for (var j = 960; j < bytes.length; j++) {
  		var i = j - 960;

  		var x = i % 8;
  		var y = Math.floor(i / 8);

  		//br bl tr tl
  		//11 01 10 00

  		var binary = bytes[j];

  		$scope.attribute_tables[table_index][x][y][0][0] = (binary & parseInt("00000011", 2));      //tl
  		$scope.attribute_tables[table_index][x][y][1][0] = (binary & parseInt("00001100", 2)) >> 2; //tr
  		$scope.attribute_tables[table_index][x][y][0][1] = (binary & parseInt("00110000", 2)) >> 4; //bl
  		$scope.attribute_tables[table_index][x][y][1][1] = (binary & parseInt("11000000", 2)) >> 6; //br
  	}
    saveToStorage();
  }

  function newArray(length, defaultValue) {
    if (defaultValue === undefined) {
      return new Array(length);
    }
    var out = [];
    for (var i = 0; i < length; i++) {
      out.push(defaultValue);
    }
    return out;
  }

  function new2DArray(length_x, length_y, defaultValue) {
    var out = [];
    for (var x = 0; x < length_x; x++) {
      if (defaultValue === undefined) {
        out.push(new Array(length_y));
      }
      else {
        var inner = [];
        for (var y = 0; y < length_y; y++) {
          inner.push(defaultValue);
        }
        out.push(inner);
      }
    }
    return out;
  }

  $scope.getAbsoluteIndex = function(x, y, y_length) {
    return y*y_length + x;
  };

  $scope.getCoordinatesFromIndex = function(i, y_length) {
		var x = i % y_length;
		var y = Math.floor(i / y_length);

    return [x, y];
  }

  $scope.getAttributePalette = function(x, y, table_index) {

  	var attribute_table_x = Math.floor(x/4);
  	var attribute_table_y = Math.floor(y/4);

  	var subarray_x = Math.floor((x - attribute_table_x*4)/2);
  	var subarray_y = Math.floor((y - attribute_table_y*4)/2);

  	return $scope.attribute_tables[table_index][attribute_table_x][attribute_table_y][subarray_x][subarray_y];
  }

  function tileFrom(first_layer, second_layer) {
    var tile = new2DArray(8, 8);
    for (var y = 0; y < 8; y++) {
      var first_binary = toPaddedBinaryString(first_layer[y]);
      var second_binary = multiplyBinaryString(toPaddedBinaryString(second_layer[y]), 2);
      var binary_string = addBinaryStrings(first_binary, second_binary);
      for (var x = 0; x < 8; x++) {
        tile[x][y] = parseInt(binary_string[x]);
      }
    }
    return tile;
  }

  function toPaddedBinaryString(number) {
    var initial = number.toString(2);
    var padding = "";
    while (padding.length < 8 - initial.length) {
      padding += "0";
    }
    return padding + initial;
  }

  function multiplyBinaryString(binary_string, multiplier) {
    var out = "";
    for (var i = 0; i < binary_string.length; i++) {
      out += ""+multiplier*parseInt(binary_string[i]);
    }
    return out;
  }

  function addBinaryStrings(binary_string_1, binary_string_2) {
    var out = "";
    for (var i = 0; i < binary_string_1.length; i++) {
      out += ""+(parseInt(binary_string_1[i]) + parseInt(binary_string_2[i]));
    }
    return out;
  }

  $scope.getIterators = function(length) {
    var out = [];

    for (var i = 0; i < length; i++) {
      out.push(i);
    }

    return out;
  };

  $scope.getRGB = function(color, alpha) {
    var out = "rgb";

    if (alpha !== null && alpha !== undefined) {
      out += "a";
    }
    out += "(";

    out += color.r + ", " + color.g + ", " + color.b;

    if (alpha !== null && alpha !== undefined) {
      out += ", " + alpha;
    }

    return out+")";
  };

  $scope.getOppositeRGB = function(color, alpha) {
    var opposite_color = {r: 255 - color.r, g: 255 - color.g, b: 255 - color.b, hex: color.hex};
    return $scope.getRGB(opposite_color, alpha);
  };

  $scope.getMainColor = function(hex) {
    return $scope.main_colors[parseInt(hex, 16)];
  };

  $scope.getSpriteColor = function(color_index) {
    return $scope.palettes.sprite[$scope.selected_palette.sprite][color_index];
  };

  $scope.selectPalette = function(palette, index) {
    $scope.selected_palette[palette] = index;
  };

  $scope.editColor = function(index) {
    $scope.selected_color = index;
  };

  $scope.selectTile = function(tile_x, tile_y) {
    $scope.active_tile_x = tile_x;
    $scope.active_tile_y = tile_y;
  };

  $scope.setNametableTile = function(tile_x, tile_y, table_index) {
    saveState();
    $scope.nametables[table_index][tile_x][tile_y] = $scope.getAbsoluteIndex($scope.active_tile_x, $scope.active_tile_y, 16);
    saveToStorage();
  };

  $scope.paintNametable = function(x, y, table_index) {
    saveState();

  	var attribute_table_x = Math.floor(x/4);
  	var attribute_table_y = Math.floor(y/4);

  	var subarray_x = Math.floor((x - attribute_table_x*4)/2);
  	var subarray_y = Math.floor((y - attribute_table_y*4)/2);

  	$scope.attribute_tables[table_index][attribute_table_x][attribute_table_y][subarray_x][subarray_y] = $scope.selected_palette.background;

    saveToStorage();
  };

  function copyOf() {
    var source_tile = $scope.tiles[$scope.tab][$scope.active_tile_x][$scope.active_tile_y];
    return JSON.parse(JSON.stringify(source_tile));
  }

  function copyOfTiles() {
    var source_tiles = $scope.tiles[$scope.tab === 'sprite' ? 'sprite' : 'background'];
    return JSON.parse(JSON.stringify(source_tiles));
  }

  function copyOfNametable() {
    var source_tiles = $scope.nametables[$scope.tab === 'nametable1' ? 0 : 1];
    return JSON.parse(JSON.stringify(source_tiles));
  }

  $scope.copy = function() {
    $scope.clipboard = copyOf();
  };

  $scope.paste = function() {
    saveState();
    setTile($scope.active_tile_x, $scope.active_tile_y, JSON.parse(JSON.stringify($scope.clipboard)));
    saveToStorage();
  };

  function setPixel(x, y, value) {
    $scope.tiles[$scope.tab][$scope.active_tile_x][$scope.active_tile_y][x][y] = value;
  }

  function setTile(x, y, value) {
    $scope.tiles[$scope.tab === 'sprite' ? 'sprite' : 'background'][x][y] = value;
  }

  function setNametableTile(x, y, value) {
    $scope.nametables[$scope.tab === 'nametable1' ? 0 : 1][x][y] = value;
  }

  function eachPixel(doFunction) {
  	var old = copyOf();
  	for (var x = 0; x < 8; x++) {
  		for (var y = 0; y < 8; y++) {
        doFunction(x, y, old);
  		}
  	}
  }

  function eachTile(doFunction) {
  	var old = copyOfTiles();
  	for (var x = 0; x < 16; x++) {
  		for (var y = 0; y < 16; y++) {
        doFunction(x, y, old);
  		}
  	}
  }

  function eachNametableTile(doFunction) {
  	var old = copyOfNametable();
  	for (var x = 0; x < 32; x++) {
  		for (var y = 0; y < 30; y++) {
        doFunction(x, y, old);
  		}
  	}
  }

  $scope.flip_horizontal = function() {
    saveState();
    eachPixel(function(x, y, old) {setPixel(x, y, old[7-x][y]);});
    saveToStorage();
  };

  $scope.flip_vertical = function() {
    saveState();
    eachPixel(function(x, y, old) {setPixel(x, y, old[x][7-y]);});
    saveToStorage();
  };

  $scope.cw = function() {
    saveState();
    eachPixel(function(x, y, old) {setPixel(x, y, old[y][7-x]);});
    saveToStorage();
  };

  $scope.ccw = function() {
    saveState();
    eachPixel(function(x, y, old) {setPixel(x, y, old[7-y][x]);});
    saveToStorage();
  };

  $scope.shift_tiles_left = function() {
    saveState();
  	eachTile(
      function(x, y, old) {
        if (!(x === 15 && y === 15)) {
          var old_x = x + 1;
          var old_y = y;
          if (old_x === 16) {
            old_x = 0;
            old_y++;
          }
          setTile(x, y, old[old_x][old_y]);
        }
        else {
          setTile(x, y, new2DArray(8, 8, 0));
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_tiles_right = function() {
    saveState();
  	eachTile(
      function(x, y, old) {
        if (!(x === 0 && y === 0)) {
          var old_x = x - 1;
          var old_y = y;
          if (old_x === -1) {
            old_x = 15;
            old_y--;
          }
          setTile(x, y, old[old_x][old_y]);
        }
        else {
          setTile(x, y, new2DArray(8, 8, 0));
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_left = function() {
    saveState();
  	eachPixel(
      function(x, y, old) {
        if (x < 7) {
          setPixel(x, y, old[x+1][y]);
        }
        else {
          setPixel(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_right = function() {
    saveState();
  	eachPixel(
      function(x, y, old) {
        if (x > 0) {
          setPixel(x, y, old[x-1][y]);
        }
        else {
          setPixel(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_up = function() {
    saveState();
  	eachPixel(
      function(x, y, old) {
        if (y < 7) {
          setPixel(x, y, old[x][y+1]);
        }
        else {
          setPixel(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_down = function() {
    saveState();
  	eachPixel(
      function(x, y, old) {
        if (y > 0) {
          setPixel(x, y, old[x][y-1]);
        }
        else {
          setPixel(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_nametable_left = function() {
    saveState();
  	eachNametableTile(
      function(x, y, old) {
        if (x < 31) {
          setNametableTile(x, y, old[x+1][y]);
        }
        else {
          setNametableTile(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_nametable_right = function() {
    saveState();
  	eachNametableTile(
      function(x, y, old) {
        if (x > 0) {
          setNametableTile(x, y, old[x-1][y]);
        }
        else {
          setNametableTile(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_nametable_up = function() {
    saveState();
  	eachNametableTile(
      function(x, y, old) {
        if (y < 29) {
          setNametableTile(x, y, old[x][y+1]);
        }
        else {
          setNametableTile(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.shift_nametable_down = function() {
    saveState();
  	eachNametableTile(
      function(x, y, old) {
        if (y > 0) {
          setNametableTile(x, y, old[x][y-1]);
        }
        else {
          setNametableTile(x, y, 0);
        }
      }
    );
    saveToStorage();
  };

  $scope.paint = function(mouseEvent, tileset, tile_x, tile_y, x, y) {
    if (mouseEvent.buttons !== 0  && mouseEvent.buttons !== 3) {
      saveState();
      var color = $scope.selected_color;
      if (mouseEvent.buttons === 2) {
        color = 0;
      }
      if (tileset === "sprite") {
        $scope.sprites[tile_x][tile_y][x][y] = color;
      }
      else {
        $scope.backgrounds[tile_x][tile_y][x][y] = color;
      }
      saveToStorage();
    }
  };

  $scope.selectMainColor = function(selected_hex) {
    var editable_palette;
    if ($scope.tab === "sprite") {
      editable_palette = "sprite";
    }
    else {
      editable_palette = "background";
    }

    var editable_subpalette_index = $scope.selected_palette[editable_palette];

    if ($scope.selected_color === 0) {
      $scope.palettes.sprite[0][0] = selected_hex;
      $scope.palettes.sprite[1][0] = selected_hex;
      $scope.palettes.sprite[2][0] = selected_hex;
      $scope.palettes.sprite[3][0] = selected_hex;
      $scope.palettes.background[0][0] = selected_hex;
      $scope.palettes.background[1][0] = selected_hex;
      $scope.palettes.background[2][0] = selected_hex;
      $scope.palettes.background[3][0] = selected_hex;
    }
    else {
      $scope.palettes[editable_palette][editable_subpalette_index][$scope.selected_color] = selected_hex;
    }
  };
});
