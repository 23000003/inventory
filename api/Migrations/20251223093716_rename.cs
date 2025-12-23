using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class rename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatRooms_ChatId",
                table: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "ChatId",
                table: "ChatMessages",
                newName: "RoomId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatMessages_ChatId",
                table: "ChatMessages",
                newName: "IX_ChatMessages_RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatRooms_RoomId",
                table: "ChatMessages",
                column: "RoomId",
                principalTable: "ChatRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatRooms_RoomId",
                table: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "ChatMessages",
                newName: "ChatId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatMessages_RoomId",
                table: "ChatMessages",
                newName: "IX_ChatMessages_ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatRooms_ChatId",
                table: "ChatMessages",
                column: "ChatId",
                principalTable: "ChatRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
