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
    method: "get",
    route: "/case/all/client",
    controller: CaseController,
    action: "allWithClient"
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
    {
        method: "get",
        route: "/client/case/:id",
        controller: ClientController,
        action: "eachWithCase"
    },
    {
        method: "get",
        route: "/client/all/case",
        controller: ClientController,
        action: "allWithCase"
    },
    {
        method: "put",
        route: "/client/:id",
        controller: ClientController,
        action: "update"
    },


    {
        method: "get",
        route: "/case",
        controller: CaseController,
        action: "all"
    }, {
        method: "get",
        route: "/case/:id",
        controller: CaseController,
        action: "one"
    },
    {
        method: "get",
        route: "/case/client/:id",
        controller: CaseController,
        action: "eachWithClient"
    },
    {
        method: "get",
        route: "/case/status/true",
        controller: CaseController,
        action: "statusTrue"
    },
    {
        method: "get",
        route: "/case/events/:id",
        controller: CaseController,
        action: "caseWithEvent"
    },
    {
        method: "get",
        route: "/case/status/false",
        controller: CaseController,
        action: "statusFalse"
    },
    {
        method: "get",
        route: "/case/event/time/:id",
        controller: CaseController,
        action: "countTimeEvent"
    },
    {
        method: "post",
        route: "/case",
        controller: CaseController,
        action: "save"
    }, {
        method: "delete",
        route: "/case/:id",
        controller: CaseController,
        action: "remove"
    }, {
        method: "put",
        route: "/case/:id",
        controller: CaseController,
        action: "update"
    },


    {
        method: "get",
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
    },
    {
        method: "put",
        route: "/event/:id",
        controller: EventController,
        action: "update"
    },]