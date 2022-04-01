import {ClientController} from "./controller/ClientController";
import {CaseController} from "./controller/CaseController";
import {EventController} from "./controller/EventController";

export const Routes = [{
    method: "get",
    route: "/client",
    controller: ClientController,
    action: "all"
}, {
    method: "get",
    route: "/client/:id",
    controller: ClientController,
    action: "one"
}, {
    method: "post",
    route: "/client",
    controller: ClientController,
    action: "save"
}, {
    method: "delete",
    route: "/client/:id",
    controller: ClientController,
    action: "remove"
},


    {method: "get",
    route: "/case",
    controller: CaseController,
    action: "all"
}, {
    method: "get",
        route: "/case/:id",
        controller: CaseController,
        action: "one"
}, {
    method: "post",
        route: "/case",
        controller: CaseController,
        action: "save"
}, {
    method: "delete",
        route: "/case/:id",
        controller: CaseController,
        action: "remove"
},


    {method: "get",
    route: "/event",
    controller: EventController,
    action: "all"
}, {
    method: "get",
    route: "/event/:id",
    controller: EventController,
    action: "one"
}, {
    method: "post",
    route: "/event",
    controller: EventController,
    action: "save"
}, {
    method: "delete",
    route: "/event/:id",
    controller: EventController,
    action: "remove"
}]