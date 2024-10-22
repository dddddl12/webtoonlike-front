export type NotificationFormT = {
    userId: number;
    type: "roundAdminAccepted" | "roundAdminRejected" | "requestReceived" | "requestAccepted" | "requestRejected" | "invoicePublished";
    message: string;
    isRead: boolean;
    arg?: any;
}

export type NotificationT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number;
    type: "roundAdminAccepted" | "roundAdminRejected" | "requestReceived" | "requestAccepted" | "requestRejected" | "invoicePublished";
    message: string;
    isRead: boolean;
    arg?: any;
}

export type GetNotificationOptionT = {
    meId?: (number | undefined) | undefined;
}

export type ListNotificationOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    userId?: number | undefined;
}
