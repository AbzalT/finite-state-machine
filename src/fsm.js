const throws = { // Исключения
    configIsMissing:       () => { throw new Error("Config is missing!") },
    stateIsMissing: () => { throw new Error("State is missing!") },
    transitionIsMissing: () => { throw new Error("Transition is missing!") }
}
class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {       
        (!config) ? configIsMissing() : false;
        this.currentConfig = config;
        this.currentState = this.currentConfig.initial;
        this.back = [];
        this.forward = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() { return this.currentState;}

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        const isStateExists = this.currentConfig.states[state];         
        (isStateExists) ? (this.back.push(this.currentState = state), this.forward = []) : (throws.stateIsMissing()); 
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {        
        const isStateExists = this.currentConfig.states[this.currentState].transitions[event];       
        (isStateExists) ? (this.back.push(this.currentState = isStateExists), this.forward = []) : (throws.transitionIsMissing());        
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.currentConfig.initial;        
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = this.currentConfig.states;
        return (event) ?
        (
            Object.entries(states).reduce((stack, [state, value]) => {
            value.transitions[event] ? stack.push(state) : false;
            return stack;          
        },[])
        ) :
        Object.keys(this.currentConfig.states);        
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        return (this.back.length == 0) ?
        false :
        (            
            this.forward.push(this.back.pop()),           
            this.currentState = (this.back.length == 0) ? this.currentConfig.initial : this.back[this.back.length-1],
            true
        );        
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
       return (this.forward.length != 0) ? (this.currentState = this.forward.pop(), true) : false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {       
        this.back = [];
        this.forward = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/