import pyperclip
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
import keyboard

#edge_service = Service(r"C:\Users\vegor\Documents\msedgedriver.exe")
edge_service = Service("D:\driver\msedgedriver.exe")
edge_options = webdriver.EdgeOptions()
edge_options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Edge(service=edge_service, options=edge_options)
driver.get("https://voltorbflip.brandon-stein.com/")
PointEls = driver.find_elements(By.CSS_SELECTOR, "div[class^='info-module--points']")
VoltorbEls = driver.find_elements(By.CSS_SELECTOR, "div[class^='info-module--bombs']")

def run_copy():
  clipboard = ""
  for i in range(len(PointEls)):
    clipboard += f"{PointEls[i].text} \n"
    clipboard += f"{VoltorbEls[i].text} \n"
  pyperclip.copy(clipboard)

keyboard.add_hotkey("c", run_copy)
keyboard.wait()