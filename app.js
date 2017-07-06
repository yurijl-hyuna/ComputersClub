var timerObg = {
    deltas: 0,
    clocktimer: [],

    update: function(begin, leftTime, id){

        var delta = (new Date()).getTime() - begin;

        this.deltas = Math.floor( delta/1000 );

        var nameSet = 'compSet' + id;

        if (delta >= leftTime*3600000) {
            clearTimeout(this.clocktimer[id]);

            VueObj.comps[id].timeSell += leftTime;
            VueObj.comps[id].money = Math.round(((VueObj.comps[id].timeSell/3600)*VueObj.timePrice) * 100) / 100;

            this.checkAllMoney();
            this.setBtnEnabled('compButt' + id);

            document.getElementById(nameSet).innerHTML = "This time costs: " + Math.round(((this.deltas/3600)*VueObj.timePrice) * 100) / 100 + "$";

            return true;
        };

        var leftHours = Math.floor( (leftTime*3600000 - delta)/3600000);
        delta = delta - Math.floor( delta/3600000)*3600000;

        var leftMins = Math.floor( (leftTime*3600000 - delta)/60000);
        delta = delta - Math.floor( delta/60000 )*60000;

        var leftSecs = Math.floor( (leftTime*3600000 - delta)/1000);

        document.getElementById(nameSet).innerHTML = 
          "left : hours: "+ this.format(leftHours, 2) + 
                " mins: "+ this.format(leftMins%60, 2) + 
                " secs: " + this.format(leftSecs%60, 2);
            
        this.clocktimer[id] = setTimeout("timerObg.update(" + begin + ", " + leftTime + ", " + id +")",1000);
    },
    format: function(num, maxNumbers) {
        var numStr = num + '';
        while(numStr.length < maxNumbers) {
            numStr = '0' + numStr;
        }
        return numStr;
    },
    stop: function(leftTime, id){
        clearTimeout(this.clocktimer[id]);

        VueObj.comps[id].timeSell += this.deltas;
        VueObj.comps[id].money = Math.round(((VueObj.comps[id].timeSell/3600)*VueObj.timePrice) * 100) / 100;

        this.checkAllMoney();

        document.getElementById('compSet' + id).innerHTML = "This time costs: " + Math.round(((this.deltas/3600)*VueObj.timePrice) * 100) / 100 + "$";
    },
    setBtnDisabled: function(name) {
        var nameId = document.getElementById(name);

        nameId.setAttribute("disabled","disabled");

        nameId.previousElementSibling
            .setAttribute("disabled","disabled");

        nameId.nextElementSibling
            .removeAttribute("disabled");
    },
    setBtnEnabled: function(name) {
        var nameId = document.getElementById(name);

        nameId.removeAttribute("disabled");
        nameId.previousElementSibling
            .removeAttribute("disabled");

        nameId.nextElementSibling.value = 0;
        nameId.nextElementSibling
            .setAttribute("disabled","disabled");
    },
    checkAllMoney: function() {
        VueObj.All_money = 0;

        for (var i = 0; i < VueObj.comps.length; i++) {
            VueObj.All_money += VueObj.comps[i].money;
        }

        VueObj.All_money = Math.round(VueObj.All_money * 100) / 100;
    },
    createComps: function (nomber) {
        for (i = 0; i < nomber; i++) {
            Vue.set(VueObj.comps, i, {
                id: i,
                timeSell: 0,
                timeBuy: 0,
                money: 0
            })
        };
        document.getElementById("firstMenu").remove();
        document.getElementsByClassName("hiden")[0].classList.remove("hiden")
    }
};

var VueObj = new Vue({
    el: '#app',
    data: {
        comps: [],
        compNomb: 0,
        timePrice: 60,
        All_money: 0,
    },
    methods: {
        onStart: function(leftTime, id) {
            if (leftTime > 0) {
                timerObg.setBtnDisabled('compButt' + id),
                timerObg.update( (new Date).getTime() , leftTime , id)
            }
        },
        onStop: function(leftTime, id) {

            timerObg.setBtnEnabled('compButt' + id),
            timerObg.stop(leftTime , id)
        },
        hawManyComputers: function(nomber) {
            timerObg.createComps(nomber)
        }
    }
})