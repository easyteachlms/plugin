/**
 * WordPress Dependencies
 */
import { BaseControl, CheckboxControl, RadioControl, TextareaControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';

const Answers = ({ question, answers, help, points, type }) => {
    const { entryData, answerHandler } = useQuiz();

    const [selectedAnswer, setSelectedAnswer] = useState(false);
    
    useEffect(()=>{
        if ( undefined !== entryData && undefined !== entryData[question] && entryData[question].length !== 0 ) {
            setSelectedAnswer(entryData[question], answers);
        }
    },[entryData]);

    const findIndex = (answer) => {
        return answers.findIndex(i => i === answer);
    }

    const handler = (answer, index) => {
        answerHandler(answer, index, type, question);
    };

    if ('text' === type) {
        return (
            <div>
                <TextareaControl
                    label="Your Answer:"
                    help={help}
                    onChange={ ( text ) => handler(text, null) }
                />
            </div>
        );
    }

    if ('single' === type) {
        return (
            <div>
                <RadioControl
                    label={'Select one answer'}
                    help={help}
                    selected={ false !== selectedAnswer ? answers[selectedAnswer[0]] : false }
                    options={answers.map((answer, index) => {
                        return {
                            value: answer,
                            label: answer
                        }
                    })}
                    onChange={ ( answer ) => {
                        console.log("Option?", answer, answers);
                        handler(answer, findIndex(answer));
                    } }
                />
            </div>
        );
    }

    return (
        <div>
            <BaseControl
                label={'Select one, or more answer(s)'}
                help={help}
            >
            {answers.map((answer, index) => {
                return(
                    <CheckboxControl
                        label={answer}
                        checked={ false !== selectedAnswer && selectedAnswer.includes(index)  }
                        onChange={ () => {
                            handler(answer, index);
                        } }
                    />
                );
            })}
            </BaseControl>
        </div>
    );
};

export default Answers;
