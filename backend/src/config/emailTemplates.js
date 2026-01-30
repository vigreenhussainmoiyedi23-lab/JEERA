const sendMail = require('./sendMail');

// Email template wrapper
const createEmailTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JEERA - ${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          color: #4b5563;
          margin-bottom: 25px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }
        .highlight {
          background-color: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          color: #92400e;
        }
        .task-info {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">JEERA</div>
          <div style="color: #6b7280; font-size: 14px;">Professional Collaboration Platform</div>
        </div>
        
        <div class="title">${title}</div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>This email was sent from JEERA</p>
          <p style="margin-top: 5px;">© 2024 JEERA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Connection Request Email
const sendConnectionRequestEmail = async (toEmail, fromUser, toUser) => {
  const title = "New Connection Request";
  const content = `
    <p>Hello <strong>${toUser.username || 'there'}</strong>,</p>
    
    <p><strong>${fromUser.username}</strong> wants to connect with you on JEERA!</p>
    
    ${fromUser.headline ? `<p><em>"${fromUser.headline}"</em></p>` : ''}
    
    <p>Accept the connection to start collaborating and networking with professionals.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/profile/${fromUser._id}" class="button">View Profile</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      If you don't want to receive connection requests, you can update your notification preferences in your settings.
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

// Connection Accepted Email
const sendConnectionAcceptedEmail = async (toEmail, fromUser, toUser) => {
  const title = "Connection Accepted!";
  const content = `
    <p>Great news, <strong>${toUser.username || 'there'}</strong>!</p>
    
    <p><strong>${fromUser.username}</strong> has accepted your connection request on JEERA!</p>
    
    ${fromUser.headline ? `<p><em>"${fromUser.headline}"</em></p>` : ''}
    
    <p>You can now collaborate, share projects, and grow your professional network together.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/profile/${fromUser._id}" class="button">Send Message</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Start the conversation by sending a message to your new connection!
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

// Task Assigned Email
const sendTaskAssignedEmail = async (toEmail, task, assignedBy, project) => {
  const title = "New Task Assigned";
  const content = `
    <p>Hello <strong>${task.assignedTo?.username || 'Team Member'}</strong>,</p>
    
    <p>You have been assigned a new task in the project <strong>${project.title}</strong>.</p>
    
    <div class="task-info">
      <h4 style="margin: 0 0 10px 0; color: #1f2937;">📋 Task Details:</h4>
      <p style="margin: 5px 0;"><strong>Task:</strong> <span class="highlight">${task.title}</span></p>
      <p style="margin: 5px 0;"><strong>Priority:</strong> ${task.priority || 'Normal'}</p>
      <p style="margin: 5px 0;"><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
      <p style="margin: 5px 0;"><strong>Assigned by:</strong> ${assignedBy.username}</p>
    </div>
    
    ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/projects/${project._id}/tasks/${task._id}" class="button">View Task</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Please review the task details and update its status as you make progress.
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

// Task Status Update Email
const sendTaskStatusUpdateEmail = async (toEmail, task, oldStatus, newStatus, updatedBy) => {
  const title = "Task Status Updated";
  const content = `
    <p>Hello <strong>${task.assignedTo?.username || 'Team Member'}</strong>,</p>
    
    <p>The task <strong>${task.title}</strong> has been updated by <strong>${updatedBy.username}</strong>.</p>
    
    <div class="task-info">
      <h4 style="margin: 0 0 10px 0; color: #1f2937;">🔄 Status Change:</h4>
      <p style="margin: 5px 0;">
        <strong>From:</strong> <span style="color: #dc2626;">${oldStatus}</span><br>
        <strong>To:</strong> <span style="color: #16a34a;">${newStatus}</span>
      </p>
    </div>
    
    ${task.description ? `<p><strong>Task Description:</strong> ${task.description}</p>` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/projects/${task.project}/tasks/${task._id}" class="button">View Task Details</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Stay updated with the latest changes to your tasks.
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

// Task Completed Email
const sendTaskCompletedEmail = async (toEmail, task, completedBy, project) => {
  const title = "Task Completed! 🎉";
  const content = `
    <p>Hello <strong>${project.createdBy?.username || 'Project Manager'}</strong>,</p>
    
    <p>Great news! The task <strong>${task.title}</strong> has been marked as completed by <strong>${completedBy.username}</strong>.</p>
    
    <div class="task-info">
      <h4 style="margin: 0 0 10px 0; color: #1f2937;">✅ Completed Task:</h4>
      <p style="margin: 5px 0;"><strong>Project:</strong> ${project.title}</p>
      <p style="margin: 5px 0;"><strong>Completed by:</strong> ${completedBy.username}</p>
      <p style="margin: 5px 0;"><strong>Completed on:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    ${task.description ? `<p><strong>Task Description:</strong> ${task.description}</p>` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/projects/${project._id}/tasks/${task._id}" class="button">Review Task</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Please review the completed task and mark it as approved if everything looks good.
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

// Project Invitation Email
const sendProjectInvitationEmail = async (toEmail, project, inviter) => {
  const title = "Project Invitation";
  const content = `
    <p>Hello <strong>${toEmail}</strong>,</p>
    
    <p><strong>${inviter.username}</strong> has invited you to join the project <strong>${project.title}</strong> on JEERA!</p>
    
    <div class="task-info">
      <h4 style="margin: 0 0 10px 0; color: #1f2937;">🚀 Project Details:</h4>
      <p style="margin: 5px 0;"><strong>Project:</strong> <span class="highlight">${project.title}</span></p>
      <p style="margin: 5px 0;"><strong>Invited by:</strong> ${inviter.username}</p>
      ${inviter.headline ? `<p style="margin: 5px 0;"><strong>Inviter's role:</strong> ${inviter.headline}</p>` : ''}
    </div>
    
    ${project.description ? `<p><strong>Project Description:</strong> ${project.description}</p>` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}/projects/${project._id}" class="button">View Project</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Join the project to start collaborating with the team!
    </p>
  `;
  
  await sendMail(toEmail, title, createEmailTemplate(title, content));
};

module.exports = {
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendTaskAssignedEmail,
  sendTaskStatusUpdateEmail,
  sendTaskCompletedEmail,
  sendProjectInvitationEmail
};
