var vm = new Vue({
  el: '#app',
  data: {
    eigenvalues: [
      129.557,103.13,14.222,10.433,9.471,
      7.778,5.523,5.325,4.183,3.321,
      2.637,2.246,2.21,1.894,1.842,
      1.758,1.7,1.605,1.58,1.564,
      1.557,1.529,1.519,1.452,1.434],
    dimensions: 25,
    activeTab: 0,
    activePC: [1, 2, 0, 2], // X, Y, Z, Color
    activeTag: false,
    activeCustomPoints: false,
    pointsNum: 0,
    modalOpen: false,
    modalSaveOpen: false,
    saveWidth: 1600,
    saveHeight: 1200,
    saveWidthValid: true,
    saveHeightValid: true,
    inputValue: '',
    textareaValue: '',
    textareaValid: true,
    clicked: null,
    hover: null,
    unhover: null,
    labelsMode: 2,
    highlightMode: 2,
    bigger: 0,
    customPointsSize: 22,
    autoLabelsLimit: 250,
    autoAnnotationsLimit: 20,
    backgroundColor: 0,
    currentColorscale: 0,
    currentHighlight: 1,
    highlightColor: 'white',
    colorscales: [
      [[
        ['0.0', 'rgb(30,54,180)'],
        ['0.07', 'rgb(0,80,210)'],
        ['0.30', 'rgb(5,250,250)'],
        ['0.60', 'rgb(250,250,0)'],
        ['0.90', 'rgb(250,5,0)'],
        ['1', 'rgb(220,0,50)']
      ]],
      [[
        ['0.0', '#ffd545'],
        ['0.07', '#ffc733'],
        ['0.30', '#ff0606'],
        ['0.60', '#0606ff'],
        ['0.90', '#06ffff'],
        ['1', '#28ffe9']
      ]],
      'Viridis','Portland','Bluered','RdBu','Rainbow','Cividis',
      [[
        ['0.0', '#333'],
        ['1', '#ddd']
      ]],
      ],
    trace: [
      {
        text: [],
        x: [],
        y: [],
        z: [],
        mode: 'markers',
        hoverlabel: {
          bgcolor: 'rgba(255,255,255,0)',
          bordercolor: 'rgba(255,255,255,0)',
          font: {
            color: 'rgba(255,255,255,0.9)'
          }
        },
        marker: {
          size: [],
          symbol: [],
          color: [],
          colorscale: '',
          reversescale: false,
          opacity: 1,
          line: {
            width: 2,
            color: 'rgba(255,0,0,0)',
            cmin: 0,
            cmax: 8,
            colorscale: [
              ['0.0', 'rgba(255,0,0,0)'],
              ['0.125', 'rgba(255,255,255,1)'],
              ['0.25', 'yellow'],
              ['0.375', 'red'],
              ['0.5', 'lime'],
              ['0.625', 'cyan'],
              ['0.750', 'blue'],
              ['0.875', 'blueviolet'],
              ['1.0', 'magenta']
            ]
          }
        },
        type: 'scatter3d',
        name: 'Points',
        hoverinfo: 'text'
      },
      {
        text: [],
        x: [],
        y: [],
        z: [],
        mode: 'text',
        type: 'scatter3d',
        name: 'Labels',
        hoverinfo: 'text',
        textposition: 'middle right',
        textfont: {
          color: '#eeeeee',
          size: 11
        }
      }
    ],
    layout: {
      xaxis: { zeroline: false },
      yaxis: { zeroline: false },
      zaxis: { zeroline: false },
      hovermode: 'closest',
      dragmode: 'turntable',
      showlegend: false,
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: '#1f1f1f',
      plot_bgcolor: 'rgba(0,0,0,0)',
      scene: {
        annotations: [],
        aspectmode: 'cube',
        bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
          color: '#444444'
        },
        yaxis: {
          color: '#444444'
        },
        zaxis: {
          color: '#444444'
        },
        camera: {
          projection: {
            type: 'perspective'
          }
        }
      }
    },
    options: {
      editable: true,
      edits: {
        titleText: false
      },
      showSendToCloud: false,
      responsive: true,
      toImageButtonOptions: {
        format: 'png',
        filename: 'Vahaduo_Eurogenes_G25_3D',
        height: 1200,
        width: 1600,
        scale: 1
      },
      modeBarButtonsToAdd: [
        {
          name: 'Toggle aspect mode: cube / data',
          icon: Plotly.Icons.drawrect,
          click: function(gd) {
            let aspectmode = 'cube';
            if (vm.layout.scene.aspectmode == 'cube') aspectmode = 'data';
            Plotly.relayout(gd, {'scene.aspectmode' : aspectmode});
          }
        },
        {
          name: 'Toggle projection: orthographic / perspective',
          icon: Plotly.Icons.drawrect,
          click: function(gd) {
            let projection = 'orthographic';
            if (vm.layout.scene.camera.projection.type == 'orthographic') projection = 'perspective';
            Plotly.relayout(gd, {'scene.camera.projection.type' : projection});
          }
        },
        {
          name: 'Toggle marker size',
          icon: Plotly.Icons.drawcircle,
          click: function(gd) {
            if (vm.bigger < 2) {
              vm.bigger++;
              for (item in vm.trace[0].marker.size) {
                vm.trace[0].marker.size[item] += (vm.trace[0].marker.symbol[item].indexOf('circle') > -1 ? 1 : 2);
                vm.size[item] += (vm.symbol[item].indexOf('circle') > -1 ? 1 : 2);
              }
            } else {
              vm.bigger = 0;
              for (item in vm.trace[0].marker.size) {
                vm.trace[0].marker.size[item] -= (vm.trace[0].marker.symbol[item].indexOf('circle') > -1 ? 2 : 4);
                vm.size[item] -= (vm.symbol[item].indexOf('circle') > -1 ? 2 : 4);
              }
            }
            Plotly.restyle(gd, {'marker.size': [vm.trace[0].marker.size]}, 0);
          }
        },
        {
          name: 'Toggle background color',
          icon: Plotly.Icons.pencil,
          click: function(gd) {
            let newColor = vm.defBackgroundColor, newDefHiColor = 'white', newTextColor = '#eeeeee', newAxisColor = '#444444';
            vm.backgroundColor == 3 ? vm.backgroundColor = 0 : vm.backgroundColor++;
            if (vm.backgroundColor == 1) {
              newColor = 'black';
              newAxisColor = '#333333'
            } else if (vm.backgroundColor == 2) {
              newTextColor = '#111111';
              newColor = 'white';
              newAxisColor = '#dddddd';
              newDefHiColor = 'black';
            } else if (vm.backgroundColor == 3) {
              newTextColor = '#111111';
              newColor = '#eeeeee';
              newAxisColor = '#cccccc';
              newDefHiColor = 'black';
            }
            if (vm.layout.scene.annotations.length > 0) {
              for (let item in vm.layout.scene.annotations) {
                vm.layout.scene.annotations[item].font.color = newTextColor;
                vm.layout.scene.annotations[item].arrowcolor = newTextColor;
              }
            }
            let layoutUpdate = {
              'paper_bgcolor': newColor,
              'scene.xaxis.color': newAxisColor,
              'scene.yaxis.color': newAxisColor,
              'scene.zaxis.color': newAxisColor
            }
            vm.trace[0].marker.line.colorscale[1][1] = newDefHiColor;
            if (vm.currentHighlight == 1) {
              vm.highlightColor = newDefHiColor;
            }
            Plotly.update(gd, {'textfont.color': newTextColor}, layoutUpdate, 1);
          }
        },
        {
          name: 'Toggle color scheme',
          icon: Plotly.Icons.pencil,
          click: function(gd) {
            vm.currentColorscale == vm.colorscales.length - 1 ? vm.currentColorscale = 0 : vm.currentColorscale++;
            Plotly.restyle(gd, {'marker.colorscale': vm.colorscales[vm.currentColorscale]}, 0);
          }
        },{
          name: 'Reverse color scheme',
          icon: Plotly.Icons.pencil,
          click: function(gd) {
            Plotly.restyle(gd, {'marker.reversescale': !vm.trace[0].marker.reversescale}, 0);
          }
        },
        {
          name: 'Download plot as png (custom size)',
          icon: Plotly.Icons.camera,
          click: function(gd) {
            vm.setSaveSize();
            vm.modalSaveOpen = true;
          }
        }
      ],
    },
    defBackgroundColor: [],
    PCs: [],
    size: [],
    symbol: [],
    labels: [],
    highlighted: []
  },
  methods: {
    plot: function () {
      this.trace[0].x = this.PCs[this.activePC[0]];
      this.trace[0].y = this.PCs[this.activePC[1]];
      this.trace[0].z = this.PCs[this.activePC[2]];
      this.trace[0].marker.color = this.PCs[this.activePC[3]];
      this.react();
    },
    reversePC: function (tab) {
      function returnReversed (arr) {
        return (arr.slice()).map(x => x * -1);
      }
      switch (tab) {
        case 0:
          this.trace[0].x = returnReversed(this.trace[0].x);
          break;
        case 1:
          this.trace[0].y = returnReversed(this.trace[0].y);
          break;
        case 2:
          this.trace[0].z = returnReversed(this.trace[0].z);
          break;
        case 3:
          this.trace[0].marker.color = returnReversed(this.trace[0].marker.color);
      }
      this.react();
    },
    react: function () {
      let newTrace = [
        {
          text: [],
          x: [],
          y: [],
          z: [],
          mode: 'text',
          type: 'scatter3d',
          name: 'Labels',
          hoverinfo: 'text',
          textposition: 'middle right',
          textfont: {
            color: this.backgroundColor > 1 ? '#111111' : '#eeeeee',
            size: 11
          }
        }
      ];
      for (let item of this.labels) {
        newTrace[0].x.push(this.trace[0].x[item]);
        newTrace[0].y.push(this.trace[0].y[item]);
        newTrace[0].z.push(this.trace[0].z[item]);
        newTrace[0].text.push('◂ ' + this.trace[0].text[item]);
      }
      for (let item of this.layout.scene.annotations) {
        item.x = this.trace[0].x[item.pointId];
        item.y = this.trace[0].y[item.pointId];
        item.z = this.trace[0].z[item.pointId];
      }
      Plotly.react('graphDiv', this.trace , this.layout, this.options);
      Plotly.deleteTraces('graphDiv', 1);
      Plotly.addTraces('graphDiv', newTrace);
    },
    switchPC: function (PC) {
      if (this.activeTab == 3) {
        this.activePC[this.activeTab] = PC;
      } else {
        for (let i = 0; i < 3; i++) {
          if (this.activePC[i] == PC && i != this.activeTab) {
            this.activePC[i] = this.activePC[this.activeTab];
          }
        }
        this.activePC[this.activeTab] = PC;
      }
      this.activePC = this.activePC.slice();
      this.plot();
    },
    tag: function () {
      if (this.activeTag) {
        let sizes = this.size.slice(), symbols = this.symbol.slice();
        this.activeTag = false;
        this.trace[0].marker.size = sizes; 
        this.trace[0].marker.symbol = symbols;
        this.react();
        this.$nextTick(() => {this.$refs.taginput.select()});
      } else {
        let sizes = this.size.slice(),
          symbols = this.symbol.slice(),
          filters = this.inputValue
            .replace(/[<>\/\\\"\';\`]/g, '')
            .replace(/,/g, ' ')
            .replace(/\s\s+/g, ' ')
            .trim(),
          newLabels = [], annotationIndex = [];
          this.inputValue = filters;
        if (this.labelsMode == 4) {
          for (let item of this.layout.scene.annotations) {
            annotationIndex.push(item.pointId);
          }
        }
        if (filters.length > 0) {
          filters = filters.split(' ');
          for (let i = 0, len = this.trace[0].text.length; i < len; i++) {
            for (let item of filters) {
              if (this.trace[0].text[i].indexOf(item) !== -1) {
                sizes[i] = 10 + (this.bigger * 2);
                symbols[i] = 'x';
                if (
                      (this.labelsMode == 2 && this.labels.indexOf(i) < 0) ||
                      (this.labelsMode == 4 && annotationIndex.indexOf(i) < 0)
                   )  {
                  newLabels.push(i);
                }
              }
            }
          }
          if (this.labelsMode == 2 && newLabels.length < this.autoLabelsLimit) {
            this.labels = this.labels.concat(newLabels);
          } else if (this.labelsMode == 4 && newLabels.length < this.autoAnnotationsLimit) {
            for (let item of newLabels) {
              this.pushAnnotation(item);
            }
          }
          this.activeTag = true;
          this.trace[0].marker.size = sizes; 
          this.trace[0].marker.symbol = symbols;
          this.react();
          this.$refs.tagbutton.focus();
        }
      }
    },
    importData: function (data, symbol, size) {
      for (let item in data) {
        for (let item2 in data[item]) {
          if (item2 != 0) {data[item][item2] = Number((data[item][item2] * this.eigenvalues[item2 - 1]).toFixed(6))}
        }
      }
      for (let i = 0, len = data.length; i < len; i++) {
        this.trace[0].text.push(data[i][0]);
        this.symbol.push(symbol);
        this.size.push(size);
        this.trace[0].marker.size.push(size);
        this.trace[0].marker.symbol.push(symbol);
        for (let j = 0; j < this.dimensions; j++) {
          this.PCs[j].push(data[i][j + 1]);
        }
      }
    },
    customPoints: function () {
      if (this.activeCustomPoints) {
        this.trace[0].text.splice(this.pointsNum);
        this.symbol.splice(this.pointsNum);
        this.size.splice(this.pointsNum);
        this.trace[0].marker.size.splice(this.pointsNum);
        this.trace[0].marker.symbol.splice(this.pointsNum);
        for (let item in this.PCs) {
          this.PCs[item].splice(this.pointsNum);
        }
        let newLabels = [];
        for (let item of this.labels) {
          if (item < this.pointsNum) {
            newLabels.push(item);
          }
        }
        this.labels = newLabels;
        let newAnnotations = [];
        for (let item of this.layout.scene.annotations) {
          if (item.pointId < this.pointsNum) {
            newAnnotations.push(item);
          }
        }
        this.layout.scene.annotations = newAnnotations;
        this.activeCustomPoints = false;
        this.plot();
      } else {
        this.modalOpen = true;
        this.$nextTick(() => {this.$refs.modaltextarea.focus()});
      }    
    },
    loadCustomPoints: function () {
      let data = this.textareaValue
        .replace(/[<>\/\\\"\';\`]/g, '')
        .replace(/[^\S\r\n]+/g, '')
        .replace(/\n\n+/g, '\n')
        .trim(),
        newLabels = [];
      if (data.length == 0) {
        this.textareaValue = '';
        return;
      } else {
        this.textareaValue = data + '\n';
      }
      data = data.split('\n');
      for (let item in data) {
        data[item] = data[item].split(',');
        for (let item2 in data[item]) {
          if (item2 != 0) {data[item][item2] = Number(data[item][item2])}
        }
      }
      if (this.validateCoordinates(data, this.dimensions)) {
        this.importData(data, 'cross', this.customPointsSize + (this.bigger * 2));
        this.activeCustomPoints = true;
        if (this.labelsMode == 2 || this.labelsMode == 4) {
          for (let i = 0, j = data.length; i < j; i++) {
            newLabels.push(this.pointsNum + i);
          }
        }
        if (newLabels.length < this.autoLabelsLimit && this.labelsMode == 2) {
          this.labels = this.labels.concat(newLabels);
        } else if (newLabels.length < this.autoAnnotationsLimit && this.labelsMode == 4) {
          for (let item of newLabels) {
            this.pushAnnotation(item);
          }
        }
        this.plot();
        this.updateHighlight(this.highlighted);
        this.modalOpen = false;
      } else {
        this.textareaValid = false;
        this.$refs.modaltextarea.focus();
      }
    },
    validateCoordinates: function (array, dimensions) {
      let dimensionsPlusOne = dimensions + 1;
      for (let item of array) {
        if (item.length != dimensionsPlusOne) {return false;}
        for (let i = 1; i < dimensionsPlusOne; i++) {
          if (isNaN(item[i])) {return false;}
        }
      }
      return true;
    },
    updateLabels: function (tnpn) {
      tnpn = tnpn.split(':');
      let tn = Number(tnpn[0]), pn = Number(tnpn[1]);
      if (tn == 0 && this.labels.indexOf(pn) < 0) {
        this.labels.push(pn);
      } else if (tn == 1) {
        this.labels.splice(pn, 1);
      } else if (tn == 0 && this.labels.indexOf(pn) > -1) {
        this.labels.splice(this.labels.indexOf(pn), 1);
      }
    },
    clearLabels: function () {
      if (this.clearLabBtnTxt == 'All' || this.clearLabBtnTxt == 'Lab.') {
        this.labels = [];
      }
      if (this.clearLabBtnTxt == 'All' || this.clearLabBtnTxt == 'Ann.') {
        this.layout.scene.annotations = [];
      }
      this.clicked = null;
      this.react();
    },
    addAnnotation: function (tnpn) {
      tnpn = tnpn.split(':');
      let tn = Number(tnpn[0]), pn = Number(tnpn[1]), push = true;
      if (tn == 1) {
        pn = this.labels[pn];
      }
      for (let item in this.layout.scene.annotations) {
        if (this.layout.scene.annotations[item].pointId == pn) {
          this.layout.scene.annotations.splice(item, 1);
          push = false;
          break;
        }
      }
      if (push) {
        this.pushAnnotation(pn);
      }
    },
    pushAnnotation: function (pn) {
      let newAnnotation = {
        pointId: pn,
        x: '',
        y: '',
        z: '',
        text: this.trace[0].text[pn],
        textangle: 0,
        ax: 0,
        ay: -75,
        font: {
          color: this.backgroundColor > 1 ? '#111111' : '#eeeeee',
          size: 11
        },
        arrowcolor: this.backgroundColor > 1 ? '#111111' : '#eeeeee',
        arrowside: 'end+start',
        arrowsize: 2,
        startarrowsize: 1,
        arrowwidth: 1,
        arrowhead: 2,
        startarrowhead: 6,
        standoff: 3,
        startstandoff: 3
      }
      this.layout.scene.annotations.push(newAnnotation);
    },
    attachEvents: function () {
      let plotNode = document.getElementById('graphDiv');
      plotNode.on('plotly_click', function(data) {
        if (vm.labelsMode > 0 || vm.highlightMode == 2) {
          let tn = data.points[0].curveNumber,
            pn = data.points[0].pointNumber,
            tnpn = tn.toString() + ':' + pn.toString();
          vm.clicked = tnpn;
        }
      });
      plotNode.on('plotly_hover', function(data){
        if (vm.highlightMode > 0) {
          let tn = data.points[0].curveNumber,
            pn = data.points[0].pointNumber;
          if (tn == 0) {
            vm.hover = (vm.trace[0].text[pn].split(':'))[0];
          }
        }
      });
    },
    highlightHover: function (name) {
      let newLine = [];
      let hoverHighlight = this.highlighted.slice();
      hoverHighlight.push([name, this.currentHighlight]);
      this.updateHighlight(hoverHighlight);
    },
    highlightClicked: function (tnpn) {
      tnpn = tnpn.split(':');
      let tn = Number(tnpn[0]), pn = Number(tnpn[1]);
      let newLine = [], name = (this.trace[0].text[pn].split(':'))[0];
      if (tn == 0) {
        let add = true;
        for (let item in this.highlighted) {
          if (this.highlighted[item][0] == name) {
            if (this.highlighted[item][1] == this.currentHighlight) {
              this.highlighted.splice(item, 1);
              add = false;
              break;
            } else {
              this.highlighted.splice(item, 1);
            }
          }
        }
        if (add) {
          this.highlighted.push([name, this.currentHighlight]);
        }
        this.updateHighlight(this.highlighted);
      }

    },
    updateHighlight: function (highlighted) {
      let newLine = [];
      for (let item of this.trace[0].text) {
        let newColor = 0;
        for (let item2 in highlighted) {
          if ((item.split(':'))[0] == highlighted[item2][0]) {
            newColor = highlighted[item2][1];
          }
        }
        newLine.push(newColor);
      }
      Plotly.restyle('graphDiv', {'marker.line.color': [newLine]}, 0);
    },
    setSaveSize: function () {
      let scene = document.getElementById('scene');
      this.saveHeightValid = true;
      this.saveWidthValid = true;
      this.saveHeight = Math.round(scene.clientHeight);
      this.saveWidth = Math.round(scene.clientWidth);
    },
    savePlot: function () {
      if (!(Number.isInteger(Number(this.saveHeight))) || Number(this.saveHeight) < 1) {
        this.saveHeightValid = false;
      }
      if (!(Number.isInteger(Number(this.saveWidth))) || Number(this.saveWidth) < 1) {
        this.saveWidthValid = false;
      }
      if (this.saveHeightValid && this.saveWidthValid) {
        Plotly.downloadImage('graphDiv',{format:'png',height:this.saveHeight,width:this.saveWidth,filename:'Vahaduo_Eurogenes_G25_3D',scale:1});
        this.modalSaveOpen = false;
      }
    }
  },
  computed: {
    isLabClearBtnActive: function () {
      let labels = this.labels.length > 0 ? true : false,
        annotations = this.layout.scene.annotations.length > 0 ? true : false;
      if (this.labelsMode == 0 && (labels || annotations)) {
        return true;
      } else if (this.labelsMode > 0 && this.labelsMode < 3 && labels) {
        return true;
      } else if (this.labelsMode > 2 && annotations) {
        return true;
      } else {
        return false;
      }
    },
    clearLabBtnTxt: function () {
      if (this.labelsMode == 0) {
        return 'All';
      } else if (this.labelsMode > 0 && this.labelsMode < 3) {
        return 'Lab.';
      } else if (this.labelsMode > 2) {
        return 'Ann.';
      }
    },
    labBtnTxt: function () {
      switch (this.labelsMode) {
        case 0:
          return 'Lab. And Ann. Off';
        case 1:
          return 'Labels: Click';
        case 2:
          return 'Labels: Auto';
        case 3:
          return 'Annotations: Click';
        case 4:
          return 'Annotations: Auto';
      }
    },

  },
  created: function () {
    if (navigator.userAgent.indexOf('Gecko') > -1 
        && navigator.userAgent.indexOf('like Gecko') < 0) {
    } else {
      this.bigger++;
    }
    for (let item in this.eigenvalues) {
      this.eigenvalues[item] = Math.sqrt(this.eigenvalues[item]);
    }
    this.trace[0].marker.colorscale = this.colorscales[this.currentColorscale][0];
    this.defBackgroundColor = this.layout.paper_bgcolor;
    for (let i = 0; i < this.dimensions; i++) {
      this.PCs.push([]);
    }
    this.importData(modern, 'circle-open', 3 + this.bigger);
    this.importData(ancient, 'circle', 2 + this.bigger);
    this.pointsNum = this.size.length;
  },
  watch: {
    highlightMode: function () {
      if (this.highlightMode == 0) {
        this.updateHighlight(this.highlighted);
      }
    },
    clicked: function () {
      if (this.clicked !== null) {
        if (this.labelsMode > 0 && this.labelsMode < 3) {
          this.updateLabels(this.clicked);
        } else if (this.labelsMode > 2) {
          this.addAnnotation(this.clicked);
        }
        if (this.highlightMode == 2) {
          this.highlightClicked(this.clicked);
        }
        this.react();
        this.clicked = null;        
      }
    },
    hover: function () {
      if (this.hover !== null && this.highlightMode > 0) {
        this.highlightHover(this.hover);  
      }
    }
  },
  mounted: function () {
    this.plot();
    this.attachEvents();
  }
})
