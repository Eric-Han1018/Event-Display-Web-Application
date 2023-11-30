import React from "react"
import '../BoothView'
// Hard code
import {removeOneComment} from '../actions/queue'

class CommentBlock extends React.Component{

    switchToProfile(){
        window.location.href = '/admin'
    }
    
    render(){
        const comment = this.props.comment
        const component = this.props.commentList
        return(
            <div className='comment' key={comment.comment_idx}>
                <div className = 'userIconContainer' onClick={this.switchToProfile}>
                    <img className ='userIcon' alt='' src={comment.userIcon? comment.userIcon: null} />
                </div>
                <div className = 'commentContentContainer'>
                    <div className="CommentArea">
                        <p className = 'userName'>{comment.userName}</p>
                        <p className = 'userComment'>{comment.comment}</p>
                    </div>
                    <div className="OperationArea">
                        <button class="deleteCommentButton" onClick={()=>{removeOneComment(component, comment.id)}}>Delete Comment</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CommentBlock