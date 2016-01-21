/**
 * Created by tkyoder on 1/18/16.
 */
var app = {

    currencyFormatter: function(value){
        var decimal = value.toFixed(2);
        var parts = decimal.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$" + parts.join(".");
    },

    FamilyMember: function(name, initialType){
        var self = this;
        self.name = ko.observable(name);
        self.memberType = ko.observable(initialType);

        self.annualGrossCost = ko.computed(function(){
            return self.memberType().yearlyCost;

        });

        self.discount = ko.computed(function(){
            if (self.name() && self.name().toLowerCase().startsWith("a")) {
                return (self.annualGrossCost() * 0.10);
            }else{
                return 0.00;
            }
        });

        self.annualNetCost = ko.computed(function(){
            return (self.annualGrossCost() - self.discount());
        });

        self.payNetCost = ko.computed(function(){
            return (self.annualNetCost()/26);
        });

        self.formatCurrency = function(value){
            return app.currencyFormatter(value);
        };
    },

    DeductionViewModel: function(){
        var self = this;

        self.memberTypes = [
            {typeName: "Employee", yearlyCost: 1000.00},
            {typeName: "Dependent", yearlyCost: 500.00}
        ];

        //Editable data
        self.members = ko.observableArray([
            new app.FamilyMember("", self.memberTypes[0])
        ]);

        self.addPerson = function () {
            self.members.push(new app.FamilyMember("", self.memberTypes[1]));
            $('input[type=text]:visible:last').focus();
        };

        self.removePerson = function(person){
            self.members.remove(person)
        };

        self.totalCost = ko.computed(function(){
            var total = 0.00;
            for (var i = 0; i < self.members().length; i++){
                total += self.members()[i].annualNetCost();
            }
            return total;
        });

        self.totalSalary = ko.computed(function(){
            var totalSal = 0.00;
            for (var i = 0; i < self.members().length; i++){
                if (self.members()[i].memberType().typeName == "Employee"){
                    totalSal += 52000.00
                }
            }
            return totalSal;
        });

        self.totalNetSalary = ko.computed(function(){
            return (self.totalSalary() - self.totalCost());
        });

        self.totalSalaryPerPay = ko.computed(function(){
            return (self.totalSalary()/26)
        });

        self.totalPerPay = ko.computed(function(){
            var total = 0.00;
            for (var i = 0; i < self.members().length; i++){
                total += self.members()[i].payNetCost();
            }
            return total;
        });

        self.totalNetSalaryPerPay = ko.computed(function(){
            return (self.totalSalaryPerPay() - self.totalPerPay());
        });

        self.formatCurrency = function(value){
            return app.currencyFormatter(value);
        };

        self.clearForm = function(value){
            window.location.reload();
        }
    }
};


if (!String.prototype.startsWith){
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    }
}


