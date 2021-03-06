import { MessageEmbed } from "discord.js";

export const defaultEmbed = (): MessageEmbed =>
  new MessageEmbed().setFooter(
    "Made by iamtheyammer and SweetPlum | d.tech Tournament Bot"
  );

export const errorEmbed = (): MessageEmbed =>
  defaultEmbed().setColor("#ff0000");

export const warnEmbed = (): MessageEmbed => defaultEmbed().setColor("#ffff00");

export const successEmbed = (): MessageEmbed =>
  defaultEmbed().setColor("#00ff00");

export const infoEmbed = (): MessageEmbed => defaultEmbed().setColor("#0099ff");
