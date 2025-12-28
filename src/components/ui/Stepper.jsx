import React from 'react';

const Stepper = ({ steps, currentStep, setStep, small, className, showLabels, maxStep, completedSteps }) => {
    return (
        <div className={`pos-relative ${className ? ` ${className}` : ''}`}>
            <div className="flex justify-between pos-relative z-1">
                {steps.map((label, index) => {
                const inCompletedSteps = completedSteps !== undefined && completedSteps !== null && index <= completedSteps;    
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const showPointer = (setStep && index < currentStep) || (setStep && maxStep !== undefined && index <= maxStep);

                return (
                    <div key={index} className="flex flex-shrink-0 align-center"
                        style={{
                            flex: index < steps.length - 1 ? 1 : 'unset',
                            marginBottom: showLabels ? 18 : 0,
                        }}
                    >
                    {/* Step */}
                    <div className="flex flex-col">
                        <div
                            onClick={() => showPointer && setStep(index)
                            }
                            className={`text-center pos-relative${showPointer ? ' pointer' : ''}`}
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            }}
                        >
                        <div
                            style={{
                                width: small ? 18 : 32,
                                height: small ? 18 : 32,
                                borderRadius: '50%',
                                border: '2px solid',
                                borderColor: (inCompletedSteps || isCompleted || isActive) ? 'var(--color-brand)' : 'var(--text-secondary)',
                                backgroundColor: isActive ? 'var(--color-light)' : (inCompletedSteps || isCompleted) ? 'var(--color-brand)' : 'var(--text-light)',
                                color: isActive ? 'var(--color-brand)' : inCompletedSteps ? "var(--text-light)" : isCompleted ? 'var(--text-light)' : 'var(--text-secondary)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                fontSize: small ? 12 : 16,
                                transition: 'all 0.3s ease',
                                zIndex: 1,
                            }}
                            data-tooltip-id="tooltip-default"
                            data-tooltip-content={`${index+1}. ${label}`}
                        >
                            {index == currentStep ? index + 1 : completedSteps && index <= completedSteps ? '✓' : isCompleted ? '✓' : index + 1}
                        </div>
                        {showLabels ?
                            <div className={`mt-1 pos-absolute${small ? " fs-10" : " fs-12"}${index == 0 ? " left-0" : index == steps.length - 1 ? " right-0" : " text-center"}${isActive ? ' text-brand weight-600' : ' text-secondary'}`}
                                style={{
                                    bottom: -22,
                                }}
                            >
                                {label}
                            </div>
                        : null}
                    </div>
                </div>
                {/* Connector: not rendered after last step */}
                    {index < steps.length - 1 && (
                        <div
                        style={{
                            flex: 1,
                            position: 'relative',
                            height: 2,
                            backgroundColor: index < currentStep ? 'var(--color-brand)' : completedSteps && index < completedSteps ? 'var(--color-brand)' : 'var(--text-secondary)',
                            margin: `0 ${small ? 8 : 16}`,
                        }}
                        />
                    )}
                    </div>
                );
            })}
            {/* Labels */}
            </div>
        </div>
    );
};

export default Stepper;
