//--------------------------|| Functions
//--------------------------------------||
function PIP_map(value,inputMin,inputMax,outputMin,outputMax) {
    outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
    return outVal;
}
//--------------------------------------||
//--------------------------------------||

//--------------------------|| PIP Objects
//--------------------------------------|| 
function PIP_Object (){

    this.i     = 0.0;
    this.decay = 0.8;

    this.update = function() {

        this.i *= this.decay;

        };
};

function PIP_Animation (min = 0, max = 1){

	this.min     = min
	this.max     = max

    this.active  = false
    this.trigger = false
    self.length  = 0.0

    this.ap      = 0.0

    this.st      = 0.0
    this.tt 	 = 0.0

    this.update = function(t) {

    	if (this.trigger && !this.active){
    		
    		this.active = true 
    		this.st     = t
    		this.tt 	= t + this.length
    	}

    	if (this.active){
    		this.ap = PIP_map(t,this.st,this.tt,this.max,this.min)

    		if (t > this.tt){this.active = false}
    	}
	    // console.log("Current time : ", t)
	    // console.log("Start time   : ", this.st)
	    // console.log("End time     : ", this.tt)
	    // console.log("Animation pos: ", this.ap)
    this.trigger = false
    };
};
//--------------------------------------|| 
//--------------------------------------|| 

