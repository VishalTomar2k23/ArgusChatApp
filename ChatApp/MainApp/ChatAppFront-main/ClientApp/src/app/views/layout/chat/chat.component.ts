import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,PickerModule,NgbModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  localPath : string = "http://localhost:5050/";
  showEmoji : boolean = false;
  emojiPickerVisible = false;
  message = '';
  @Output() dataEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() conversations = [];
  @Input() currentUserId :any ;
  @Input() currentUserName : any;
  @Input() otheruserName : string;


  userId : string ;
  imageFile: File;
  constructor(private chatService :ChatService, private authService : AuthService,private modalService : NgbModal) {
    
  }
  
  ngOnInit(){
      console.log(this.otheruserName);
      console.log("fsda f af " , this.currentUserName);
      this.chatService.GetUserId(this.otheruserName).subscribe((userId)=>{
         this.userId = userId;
      })
  }

 Emoji(event, message :any){
  
  const text = message.value + event.emoji.native;
  message.value = text;
  this.showEmoji = false;
}

toggleEmoji(message :any){
  this.showEmoji = !this.showEmoji;
}

  submitMessage(event) {
    // getting content from the textarea 
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    // console.log("hei");
    // console.log(this.currentUserId);
    // console.log(this.currentUserName);
    // console.log(this.otheruserName);

    console.log(value);
    
    this.chatService.sendMessage(this.currentUserId,this.userId,value,0,'Null').subscribe((data)=>{
       this.chatService.Message.next(this.currentUserName);
       this.dataEmitter.emit([value,this.userId]);
    });
    

    

    return true;
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }

  recentChatDate(date :Date){
    return this.chatService.recentChatDate(date);
  }
  
  
  openBasicModal(content) {
    this.modalService.open(content, {}).result.then((result) => {
    }).catch((res) => {});
  }

  onFileSelected(event){
    if (event.target.files.length > 0) {
      this.imageFile = (event.target as HTMLInputElement).files[0];
    }
  }

  uploadFile(){
    console.log('Sending.....');
    const formdata = new FormData();
    formdata.append('File',this.imageFile),
    formdata.append('SenderId',this.userId),
    formdata.append('ReceiverId',this.currentUserId),
    formdata.append('Content','this is not shown to user'),
    formdata.append('ReplyedToId','0'),
    formdata.append('Type','Any');
    this.chatService.sendFileMessages(formdata).subscribe((data)=>{
      console.log(data);
    })
    
  }

  // Implement the logic for replying to a message.
  method2(){

  }
}
