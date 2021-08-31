import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { RootState } from '../../app/store'
import { EntityId } from '@reduxjs/toolkit'

export const PostAuthor = ({ userId }: { userId: EntityId }) => {
    const author = useSelector((state: RootState) =>
        selectUserById(state, userId)
    )
    // the {return} keyword is required to be declared explicitly because the component is an arrow function that returns a block of code. 
    // the {return} keyword is only used implicitly if the arrow function is not returning a block.
    // in case of only returning JSX, you can use you can use parentheses to wrap the implicitly returned JSX:
    // const FunctionalComponent = () => (
    //     <div>
    //       <OtherComponent />
    //     </div>
    // );
    return <span>by {author ? author.name : 'Unknown author'}</span>
}

// use React.FC to type function if you want you component to have children because it always imply that there will be children in your component
// don't use React.FC if you just want to have the typing of your props and not having children included in your component.