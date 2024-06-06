import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { converEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
    
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent) => {
        try {

            // Si todo esta bien
            if(calendarEvent.id && calendarEvent.user !== user) {
                // Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            else {
                // Llegar al backend
                const { data } = await calendarApi.post('/events', calendarEvent);
                
                // Creando
                dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user}));
            }
            
        } catch (error) {
            
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');

        }
    }

    const startDeletingEvent = async() => {
        // Llegar al backend
        try {
            
            await calendarApi.delete(`/events/${ activeEvent.id }`)
            dispatch(onDeleteEvent());
            
        } catch (error) {
            
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');

        }
    }

    const startLoadingEvents = async() => {
        try {
            
            const { data } = await calendarApi.get('/events');
            const events = converEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));

        } catch (error) {
            
            console.log('Error cargando eventos');
            console.log(error);

        }
    }

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* Métodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }
}
