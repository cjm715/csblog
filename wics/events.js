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

function populationSliderEvent() {
    populationTxtBox.value(populationSlider.value())
    initilizeFlockSim()
}

function populationTextBoxEvent() {
    populationSlider.value(populationTxtBox.value())
    initilizeFlockSim()
}
