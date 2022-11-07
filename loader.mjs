import generateAliasesResolver from "esm-module-alias";
const aliases = {
	"Scenes": "src/scenes/",
	"GameObjects": "src/gameobjects/",
	"Utilities": "src/utilities/",
};
export const resolve = generateAliasesResolver(aliases);
