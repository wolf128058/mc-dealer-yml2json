#!/usr/bin/env python3

"""
Minecraft Händler-YML zu JSON-Konverter

Autor: VollmondHeuler
Lizenz: CC-BY 4.0

Beschreibung:
Gibt einen JSON Array aus für ein Data-Verzeichnis voller Händlerdaten
"""

import os
import yaml
import json
import re
import traceback

def clean_minecraft_string(text):
    # Muster für Minecraft-Formatierungscodes
    pattern = re.compile(r'§[0-9a-fklmnor]')    
    return re.sub(pattern, '', text)    

def read_yaml_files(directory):
    data_dict = {}
    for filename in os.listdir(directory):
        if filename.endswith(".yml"):
            with open(os.path.join(directory, filename), "r", encoding="utf-8") as file:
                data = yaml.safe_load(file)
                # Assuming 'ownerUUID' exists in each YAML file
                uuid = data.get("ownerUUID")
                if uuid:
                    data_dict[uuid] = data
                    # print(data)
    return data_dict

# Verzeichnis mit den YAML-Dateien angeben
directory_path = "data/"
result_dict = read_yaml_files(directory_path)

if __name__ == '__main__':
    try:
        player_shops = []
        for shop in result_dict:
            player_shop =  {}

            # Meta-Daten des Shops
            player_shop['owner_uuid'] = result_dict[shop]['ownerUUID']
            player_shop['owner_name'] = result_dict[shop]['ownerName']
            player_shop['shop_name'] = clean_minecraft_string(result_dict[shop]['entity']['name'])
            player_shop['npc_profession'] =result_dict[shop]['entity']['profession']
            player_shop['location'] = {
                'world':  result_dict[shop]['entity']['location']['world'],
                'x': result_dict[shop]['entity']['location']['x'],
                'y':  result_dict[shop]['entity']['location']['y'],
                'z':  result_dict[shop]['entity']['location']['z']
                }

            # Angebote des Händlers
            player_offers = {}
            if 'items_for_sale' in result_dict[shop]:
                for offer in result_dict[shop]['items_for_sale']:
                    offer_data = result_dict[shop]['items_for_sale'][offer]
                    if offer_data['mode'] == 'SELL':
                        player_offer = {}
                        player_offer['own_name'] = None
                        item_type = offer_data['item']['type']
                        item_index = item_type
                        
                        if item_type == 'POTION':
                            if 'potion-type' in  offer_data['item']['meta']:
                                item_type = offer_data['item']['meta']['potion-type']
                                item_index = item_type
                            else:
                                own_name = offer_data['item']['meta']['display-name']
                                item_index = own_name

                        if 'meta' in offer_data['item'] and 'display-name' in offer_data['item']['meta']:
                            json_displayname = json.loads( offer_data['item']['meta']['display-name'])
                            if 'extra' in json_displayname:
                                player_offer['own_name'] = json_displayname['extra'][0]['text']
                                item_index = player_offer['own_name']
                            elif 'translate' in json_displayname:
                                player_offer['own_name'] = json_displayname['translate']
                                item_index = player_offer['own_name']
                        
                        player_offer['item'] = item_type
                        player_offer['amount'] = offer_data['amount']
                        player_offer['price'] = offer_data['price']

                        player_offer['price_discount'] = 0
                        if 'discount' in offer_data and 'amount' in offer_data['discount']:
                            player_offer['price_discount'] = offer_data['discount']['amount']

                        player_offer['unit_price'] = round(offer_data['price'] / offer_data['amount'], 2)
                        player_offer['stock'] = 0

                        player_offers[item_index] = player_offer

            # Lagerbestände
            player_stocks = {}
            if 'storage' in result_dict[shop]:
                for stock in result_dict[shop]['storage']:
                    item_type = stock['type']
                    item_index = stock['type']
                        
                    if item_type == 'POTION':
                        if 'potion-type' in stock['meta']:
                            item_type = stock['meta']['potion-type']
                            item_index = item_type
                        else:
                            own_name = stock['item']['display-name']
                            item_index = own_name

                    if 'meta' in stock and 'display-name' in stock['meta']:
                        json_displayname = json.loads(stock['meta']['display-name'])
                        if 'extra' in json_displayname:
                            item_index = json_displayname['extra'][0]['text']
                        elif 'translate' in json_displayname:
                            item_index = json_displayname['translate']

                    if item_index not in player_stocks and 'amount' in stock:
                        player_stocks[item_index] = stock['amount']
                    elif 'amount' in stock:
                        player_stocks[item_index] += stock['amount']
              
                # Lagerbestände in die Angebote übertragen
                for stock_key in player_stocks:
                    if stock_key in player_offers:
                        player_offers[stock_key]['stock'] = player_stocks[stock_key]

            player_shop['offers'] = player_offers
            player_shops.append(player_shop)

        # Datenausgabe als JSON-Datei
        with open("output.json", "w") as outfile:
            outfile.write(json.dumps(player_shops))

        # Error Handling (Fehlerausgabe im Fehlerfall)
        pass
    except Exception as e:
        traceback.print_exc()
