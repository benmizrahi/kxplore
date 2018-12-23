import { Component, Output, EventEmitter } from "@angular/core";
import { UserProfileService } from "../../../services/user-profile.service";

@Component({
    selector: 'message-config-columns',
    template:`
        <ul class="tags">
            <li class="addedTag" *ngFor="let item of items">{{item}}
            <span (click)="removeTag(item)" class="tagRemove">x</span>
            <li class="tagAdd taglist">  
                    <input type="text" id="search-field" [(ngModel)]="newItem"   (keydown)=onKeydownEvent($event)>
                </li>
        </ul>
    `,
    styles:[`
    ol, ul {
        list-style: outside none none;
    }
    #container {
        margin: 0 auto;
        width: 60rem;
    }
    .tags {
        background: none repeat scroll 0 0 #fff;
        display: table;
        padding: 0.5em;
        width: 100%;
        font-size: 14px;
        border-bottom:none;
    }
    .tags li.tagAdd, .tags li.addedTag {
        float: left;
        margin-left: 0.25em;
        margin-right: 0.25em;
    }
    .tags li.addedTag {
        background: none repeat scroll 0 0 #019f86;
        border-radius: 2px;
        color: #fff;
        padding: 0.25em;
    }
    .tags input, li.addedTag {
        border: 1px solid transparent;
        border-radius: 2px;
        box-shadow: none;
        display: block;
        padding: 0.5em;
    }
    .tags input:hover {
        border: 1px solid #000;
    }
    span.tagRemove {
        cursor: pointer;
        display: inline-block;
        padding-left: 0.5em;
    }
    span.tagRemove:hover {
        color: #222222;
    }
    P, H1 {
        text-align: center;
    }
    p {
        color: #ccc;
    }
    h1 {
        color: #6b6b6b;
        font-size: 1.5em;
    }
    
    
    `]
})

export class ConfigColumns{

    constructor(private readonly userProfileService:UserProfileService){
        
    }

    @Output() changed = new EventEmitter<void>();

    newItem = ''
    items = this.userProfileService.userColumns

    removeTag = (item) =>{
        let index = this.items.indexOf(item);
        this.items.splice(index, 1); 
        this.changed.emit()
    }

    onKeydownEvent = (event) => {
        if (event.keyCode === 13 ) {
            if(this.items.indexOf(this.newItem) > -1) {
                return;
            }
            this.items.push(this.newItem)
            this.newItem = ''
            this.changed.emit()
        }
    }
}