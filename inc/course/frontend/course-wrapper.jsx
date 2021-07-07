/**
 * WordPress Dependencies
 */
import { useEffect, useState, Fragment, RawHTML } from '@wordpress/element';
import { Card, CardBody, CardHeader, CardFooter, Flex, FlexBlock, FlexItem, Spinner } from '@wordpress/components';
 
/**
 * Internal Dependencies
 */
import { useCourse } from './context';
import Dashboard from './dashboard';
import Menu from './menu';
import Quiz from './quiz';
import Toolbar from './toolbar';
import './style.scss';
 
const CourseWrapper = ({children}) => {  
    const { loaded, currentlyActive } = useCourse();

    const CardTitle = () => {
        return(
            <CardHeader>
                <h3>{currentlyActive.title}</h3>
            </CardHeader>
        );
    }

    if ( false === loaded ) {
       return(
        <Card>
            <CardBody>
                <h3>Loading... <Spinner/></h3>
            </CardBody>
        </Card>
       );
    }

    return(
        <Flex align="flex-start">
            <FlexItem className="menu">
                <Card>
                    <CardBody>
                        <Menu/>
                    </CardBody>
                </Card>
            </FlexItem>
            <FlexBlock className="content">
                <Card>
                    {false !== loaded && (
                        <Fragment>
                            {false !== currentlyActive.title && <CardTitle/>}
                            <CardBody>
                                {'dashboard' === currentlyActive.target && (
                                    <Dashboard/>
                                )}
                                <RawHTML>{children}</RawHTML>
                                {'quiz' === currentlyActive.type && (
                                    <Quiz/>
                                )}
                            </CardBody>
                            {!['dashboard', 'quiz', false].includes(currentlyActive.type) && (
                                <CardFooter>
                                    <Toolbar/>
                                </CardFooter>
                            )}
                        </Fragment>
                    )}
                </Card>
            </FlexBlock>
        </Flex>
    );
}

export default CourseWrapper;