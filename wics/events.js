function cohesionTxtBoxEvent() {
    cohesionSlider.value(cohesionTxtBox.value())
}

function cohesionSliderEvent() {
    cohesionTxtBox.value(cohesionSlider.value())
}

function alignSliderEvent() {
    alignTxtBox.value(alignSlider.value())
}

function alignTxtBoxEvent() {
    alignSlider.value(alignTxtBox.value())
}

function seperationTxtBoxEvent() {
    seperationSlider.value(seperationTxtBox.value())
}

function seperationSliderEvent() {
    seperationTxtBox.value(seperationSlider.value())
}

function popluationSliderEvent() {
    populationTxtBox.value(popluationSlider.value())
    initilizeFlockSim()
}

function popluationTextBoxEvent() {
    popluationSlider.value(populationTxtBox.value())
    initilizeFlockSim()
}
