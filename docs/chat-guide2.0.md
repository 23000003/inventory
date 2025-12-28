# Read/Unread Property

1. If both users are in connection then ``sender's`` message will automatically marked as read by ``receiver``.


2. Whenever a user sends a message, all un-read messages are marked as read, and also sends a ``invalidation key`` for react query to update my unread message in real-time..


![alt text](image-5.png)

<br/><br/>

3. If you didn't use react query, you can either manipulate in Frontend or create ur own broadcast.

<br/><br/>

4. Mark as read endpoint for sales ``{base}/chat/mark-as-read/{roomId}``.

![alt text](image-6.png)