import { addComment, removeComment } from "utils/booth"
import {cancelAppointmentAPI} from "utils/user"
const log = console.log;

export const addNewComment = queue => {
    log("adding comment");
    const newComment = {
        user: queue.state.currentUser.userId,
        comment: queue.state.newCommentContent,
        score:3
    };
    log(newComment)
    addComment(queue, newComment, queue.state.boothId)
    log(queue.state)
}
  
export const removeOneComment = (component, deletingCommentID) => {
    removeComment(component, component.state.boothId, deletingCommentID)
}

export const cancelAppointment = (comp, boothid, userid, time) => {
    cancelAppointmentAPI(comp, time, boothid, userid)
    comp.setState({
        currentAppointment: null
    })  
};