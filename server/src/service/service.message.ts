import { prisma } from "../lib/prisma";
import { saveMessageParams, saveMessageResponse } from "../types/message.type";

export async function check_member(
  send_to_server_id: number,
  current_user: number
): Promise<boolean> {
  try {
    const ismember = await prisma.server.findFirst({
      where: {
        id: send_to_server_id,
        members: { some: { id: current_user } },
      },
    });

    if (ismember) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("error occured while checking member: service.message.ts");
    return false;
  }
}

export async function save_message(
  message: saveMessageParams
): Promise<saveMessageResponse> {

  try {
    const savedMessage = await prisma.message.create({
      data: {
        userId: message.userId,
        channelId: message.channelId,
        serverId: message.serverId,
        content: message.content,
      },
    });

    return { success: true, message: "message saved!" };

  } catch (error) {
    
    return { success: false, error: "message not saved!" };
  }
}
