import React, { Component } from 'react'
import { func, instanceOf } from 'prop-types'
import { onStringChange } from 'src/models/helpers/onStringChange'
import { EnumSubmodelType } from 'src/lib/types/models/EnumSubmodelType'
import { dialogTypeOnBlur } from 'src/models/helpers/dialogTypeOnBlur'
import { dialogTypeOnDone } from 'src/models/helpers/dialogTypeOnDone'
import { Steps } from 'src/models/components/dialogs/Steps'
import { EnumControlSmart } from 'src/models/components/dialogs/enum-type/EnumControlSmart'
import { dialogConstructor } from 'src/models/helpers/dialogConstructor'
import { onBooleanChange } from 'src/models/helpers/onBooleanChange'

export class EnumProp extends Component {
  static propTypes = {
    onClose: func.isRequired,
    onStepChange: func.isRequired,
    onFirstBack: func,
    onDone: func.isRequired,
    initialModel: instanceOf(EnumSubmodelType),
  }

  static defaultProps = {
    initialModel: null,
    onFirstBack: null,
  }

  getClearState() {
    return {
      step: 1,
      model: {
        type: 'enum',
        // validation fix - enum will init deeper
        enum: [],
        requiredProperty: false,
      },
      errors: {
        propertyName: '',
        title: '',
        description: '',
      },
    }
  }

  constructor(props) {
    super(props)
    const { initialModel } = props
    dialogConstructor.call(this, props, initialModel)
  }

  componentDidMount() {
    const { onStepChange } = this.props
    onStepChange(1, 2)
  }

  onStringChange(...props) {
    onStringChange.call(this, ...props)
  }

  onBooleanChange(...props) {
    onBooleanChange.call(this, ...props)
  }

  onBlur(field) {
    dialogTypeOnBlur.call(this, { Type: EnumSubmodelType, field })
  }

  onNext() {
    const { onStepChange } = this.props
    const onDone = model => {
      this.setState({ step: 2 })
      onStepChange(2, 2)
    }
    dialogTypeOnDone.call(this, {
      Type: EnumSubmodelType,
      fields: ['title', 'description', 'propertyName'],
      onDone,
    })
  }

  onBack() {
    const { onStepChange } = this.props
    this.setState({ step: 1 })
    onStepChange(1, 2)
  }

  onDone(enumState) {
    const { onDone } = this.props
    const { model } = this.state
    delete model.default
    delete model.enum
    model.enum = enumState.enum
    if (enumState.hasOwnProperty('default')) {
      model.default = enumState.default
    }
    onDone(model)
  }

  render() {
    const { model, errors, step } = this.state
    const { onClose, onFirstBack, initialModel } = this.props
    const enumControl = (
      <EnumControlSmart
        onClose={onClose}
        onBack={() => this.onBack()}
        onDone={enumState => this.onDone(enumState)}
        initialModel={initialModel}
      />
    )
    return step === 1 ? (
      <Steps
        onSelectChange={() => {}}
        onStringChange={(...props) => this.onStringChange(...props)}
        onNumberChange={() => {}}
        onBooleanChange={(...props) => this.onBooleanChange(...props)}
        onBlur={(...props) => this.onBlur(...props)}
        onClose={onClose}
        onBack={onFirstBack}
        onNext={(...props) => this.onNext(...props)}
        onDone={() => {}}
        step={1}
        steps={[
          [
            {
              type: 'string',
              name: 'propertyName',
              label: 'Property name',
              required: true,
              value: model.propertyName,
              error: errors.propertyName,
            },
            {
              type: 'string',
              name: 'title',
              label: 'Title',
              required: true,
              value: model.title,
              error: errors.title,
            },
            {
              type: 'string',
              name: 'description',
              label: 'Description',
              required: false,
              value: model.description,
              error: errors.description,
            },
            {
              type: 'checkox',
              name: 'requiredProperty',
              label: 'Required property',
              value: model.requiredProperty,
            },
          ],
        ]}
      />
    ) : (
      enumControl
    )
  }
}
